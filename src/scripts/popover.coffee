$         = require "./query"
element   = require "./element"
request   = require "./request"
xmlToJson = require "./xml_to_json"
arrow     = require "./components/arrow"
header    = require "./components/header"
entry     = require "./components/entry"

build = (search, tree) ->
  base = element.create entry(search, tree)
  return base

module.exports = popover =
  create: (search) ->
    width  = 600
    height = 800
    div    = element.create
      attrs:
        class: "ged-popover"

      children: [
        header this
      ]

    loading = element.create
      text: "LOADING..."

    div.appendChild loading

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

      loading.remove()
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
