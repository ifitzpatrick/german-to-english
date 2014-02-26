popover = require "./popover"

document.addEventListener "keydown", (event) ->
  selection = document.getSelection()

  if event.which is 71 and event.altKey and selection
    node = selection.anchorNode.parentElement
    text = selection.toString()

    popover.create text

  else if event.which is 27
    popover.replace()

