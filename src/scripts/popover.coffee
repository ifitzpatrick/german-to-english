$         = require "./query"
element   = require "./element"
request   = require "./request"
xmlToJson = require "./xml_to_json.coffee"

build = (search, tree) ->
  base = element.create "div",
    class: "ged-popover-content"

  form = element.create "form"
  base.appendChild form

  searchBar = element.create "input"
  form.appendChild searchBar

  submit = element.create "button",
    type: "submit"

  submit.innerText = "search"
  form.appendChild submit

  form.addEventListener "submit", (event) ->
    popover.create searchBar.value

    event.preventDefault?()
    return false

  close = element.create "div",
    class: "ged-popover-close"

  close.innerHTML = "&times;"
  base.appendChild close

  close.addEventListener "click", ->
    popover.replace()

  title = element.create "h1"
  title.innerText = search
  base.appendChild title

  for section in tree.sections
    sectionDiv = element.create "div"
    base.appendChild sectionDiv

    sectionTitle           = element.create "h2"
    sectionTitle.innerText = section.name

    sectionDiv.appendChild sectionTitle

    defTable = element.create "table"
    sectionDiv.appendChild defTable

    for definition in section.definitions
      defRow = element.create "tr"
      defTable.appendChild defRow
      for lang in definition.langs
        cell = element.create "td"
        cell.innerText = lang.text
        defRow.appendChild cell

  return base

module.exports = popover =
  create: (search) ->
    width  = 600
    height = 800
    div    = element.create "div",
      class: "ged-popover"

    url =
      "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=#{search}"

    div.innerText = "LOADING..."
    @replace div

    request(url).then (res) ->
      xml = res.responseText
      spec =
        name: "sections"
        selector: "section"
        attrs:
          name: "sctTitle"

        children: [
          name: "definitions"
          selector: "entry"
          children: [
            name: "langs"
            selector: "side"
            attrs:
              lang: "lang"

            text: true
          ]
        ]

      tree = xmlToJson xml, spec
      div.innerHTML = ""
      div.appendChild build(search, tree)

    , ->
      div.innerText = "ERROR"

  replace: (newPopover = null) ->
    body = $("body")[0]
    if @current
      @current.remove()

    if newPopover
      body.appendChild newPopover

    @current = newPopover

  current: null
