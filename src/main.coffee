popover = require "./popover"

document.addEventListener "keydown", (event) ->
  selection = document.getSelection()

  if event.which is 68 and event.ctrlKey and selection
    node = selection.anchorNode.parentElement
    text = selection.toString()
    x    = node.offsetLeft + node.offsetWidth
    y    = node.offsetTop

    popover.create x, y, text

  else if event.which is 27
    popover.replace()

