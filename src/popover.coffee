$       = require "./query"
element = require "./element"
request = require "./request"

nodeToJSON = (dom, nodeSpec, tree = {}) ->
  tree[nodeSpec.name] = nodes =
    for ele in dom.querySelectorAll nodeSpec.selector
      node = {}
      for own key, attrName of nodeSpec.attrs or {}
        node[key] = ele.getAttribute attrName

      if nodeSpec.text
        node["text"] = ele.textContent

      for childNodeSpec in nodeSpec.children or []
        nodeToJSON ele, childNodeSpec, node

      node

  return tree

dataTree = (xml, spec) ->
  parser = new DOMParser
  dom = parser.parseFromString xml, "application/xml"
  nodeToJSON dom, spec

build = (tree) ->
  base = element.create "div"

  for section in tree.sections
    sectionDiv = element.create "div"
    base.appendChild sectionDiv

    sectionTitle           = element.create "h1"
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

module.exports =
  create: (x, y, search) ->
    width  = 600
    height = 800
    div    = element.create "div",
      width:      width + "px"
      height:     height + "px"
      position:   "absolute"
      left:       x.toString() + "px"
      top:        y.toString() + "px"
      background: "white"
      overflowY:  "auto"
      zIndex:     999

    url  =
      "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=#{search}"

    div.innerText = "LOADING..."
    @replace div

    request(url).then (res) ->
      try
        body = res.responseText
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
        tree = dataTree body, spec
        div.innerHTML = ""
        div.appendChild build tree

      catch e
        debugger

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
