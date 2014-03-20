Dict.factory "getSelection", ->
  #node = selection.anchorNode.parentElement
  ->
    document.getSelection()?.toString()

