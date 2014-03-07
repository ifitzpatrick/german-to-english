$         = require "./query"
element   = require "./element"
request   = require "./request"
xmlToJson = require "./xml_to_json"
header    = require "./components/header"
entry     = require "./components/entry"

module.exports = popover =
  buildEntry: (search, tree) ->
    element.create entry(search, tree)

  refresh: ->
    @entry?.remove()
    @entry = @previous[@marker]
    @current.appendChild @entry
    @currentHeader.update @canBack(), @canForward()

  canForward: -> @marker > 0
  forward: ->
    if @canForward()
      @marker--
      @refresh()

  canBack: -> @marker < @previous.length - 1
  back: ->
    if @canBack()
      @marker++
      @refresh()

  create: (search="") ->
    @currentHeader = header this
    div            = element.create
      attrs:
        class: "ged-popover"

      children: [
        @currentHeader
      ]

    @replace div

    if not search and not @previous.length
      div.appendChild element.create
        text: "Type searches into search bar above, or select a word and right click"

    else if not search
      @refresh()

    else
      loading = element.create
        text: "LOADING..."

      div.appendChild loading

      url =
        "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=#{search}"

      request(url).then (res) =>
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

        @entry = @buildEntry(search, tree)
        @previous.unshift @entry
        @marker = 0
        div.appendChild @entry
        @currentHeader.update @canBack(), @canForward()

      , ->
        loading.remove()
        div.appendChild element.create text: "ERROR"

  replace: (newPopover = null) ->
    body = $("body")[0]
    if @current
      @current.remove()

    if newPopover
      body.appendChild newPopover

    @current = newPopover

  current: null
  previous: []

