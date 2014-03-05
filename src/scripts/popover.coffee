$         = require "./query"
element   = require "./element"
request   = require "./request"
xmlToJson = require "./xml_to_json"
arrow     = require "./components/arrow"

build = (search, tree) ->
  base = element.create
    attrs:
      class: "ged-popover-content-wrapper"

    children: [
      tag: "form"
      children: [
        #arrow.left()
        #arrow.right()
        tag: "input"
      ,
        tag: "button"
        text: "Search"
        attrs:
          type: "submit"
      ]
      events: [
        type: "submit"
        handler: (event) ->
          popover.create searchBar.value

          event.preventDefault?()
          return false
      ]
    ,
      attrs:
        class: "ged-popover-close"
      html: "&times;"
      events: [
        type: "click"
        handler: -> popover.replace()
      ]
    ,
      attrs:
        class: "ged-popover-content"

      children: [
        tag: "h1"
        text: search
      ,
        children: (for section in tree.sections
          do (section) ->
            attrs:
              class: "ged-popover-section"

            children: [
              tag: "h2"
              text: section.name
            ,
              tag: "table"
              children: (for definition in section.definitions
                do (definition) ->
                  tag: "tr"
                  children: (for lang in definition.langs
                    do (lang) ->
                      tag: "td"
                      text: lang.text
                  )
              )
            ]
        )
      ]
    ]

  return base

module.exports = popover =
  create: (search) ->
    width  = 600
    height = 800
    div    = element.create
      attrs:
        class: "ged-popover"
      text: "LOADING..."

    url =
      "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=#{search}"

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
