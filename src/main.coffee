$ = (selector) ->
  document.querySelectorAll selector

currentPopover = null

replacePopover = (newPopover = null) ->
  body = $("body")[0]
  if currentPopover
    currentPopover.remove()
  
  if newPopover
    body.appendChild newPopover

  currentPopover = newPopover

createElement = (tag, styles) ->
  ele = document.createElement tag
  for own key, value of styles
    ele.style[key] = value

  return ele

request = (url) ->
  new Promise (resolve, reject) ->
    GM_xmlhttpRequest
      method: "GET"
      url: url
      onload: (res) ->
        resolve res

      onerror: (error) ->
        reject error

nodeToJSON = (dom, nodeSpec, tree = {}) ->
  tree[nodeSpec.name] = nodes =
    for element in dom.querySelectorAll nodeSpec.selector
      node = {}
      for own key, attrName of nodeSpec.attrs or {}
        node[key] = element.getAttribute attrName

      if nodeSpec.text
        node["text"] = element.textContent

      for childNodeSpec in nodeSpec.children or []
        nodeToJSON element, childNodeSpec, node

      node

  return tree

dataTree = (xml, spec) ->
  parser = new DOMParser
  dom = parser.parseFromString xml, "application/xml"
  nodeToJSON dom, spec

popover = (x, y, search) ->
  width  = 600
  height = 800
  div    = createElement "div",
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
  replacePopover(div)
  request(url).then (res) ->
    try
      body = res.responseText
      spec =
        name: "sections"
        selector: "section"
        attrs:
          sectionName: "sctTitle"

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
      text = JSON.stringify tree, null, 4
      div.innerHtml = ""
      div.innerText = text

    catch e
      debugger

  , ->
    div.innerText = "ERROR"

document.addEventListener "keydown", (event) ->
  selection = document.getSelection()
  if event.which is 68 and event.ctrlKey and selection
    node = selection.anchorNode.parentElement
    text = selection.toString()
    x = node.offsetLeft + node.offsetWidth
    y = node.offsetTop
    popover x, y, text

  else if event.which is 27
    replacePopover()

