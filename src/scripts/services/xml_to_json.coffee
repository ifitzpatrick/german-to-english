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

Dict.factory "xmlToJson", ->
  (xml, spec) ->
    parser = new DOMParser
    dom = parser.parseFromString xml, "application/xml"
    nodeToJSON dom, spec

