$ = (selector) ->
  document.querySelectorAll selector

currentPopover = null

removePopover = ->
  if currentPopover
    currentPopover.remove()

  currentPopover = null

popover = (x, y, search) ->
  div    = document.createElement("div")
  body   = $("body")[0]
  iframe = document.createElement("iframe")
  width  = 600
  height = 800
  url    = "http://dict.leo.org/#/search=#{search}&searchLoc=0&resultOrder=basic&multiwordShowSingle=on"

  iframe.setAttribute "src", url
  iframe.width = width
  iframe.height = height
  div.style.width = width + "px"
  div.style.height = height + "px"
  div.style.position = "absolute"
  div.style.left = x.toString() + "px"
  div.style.top = y.toString() + "px"
  body.appendChild div
  div.appendChild iframe

  removePopover()
  currentPopover = div

document.addEventListener "keydown", (event) ->
  selection = document.getSelection()
  if event.which is 68 and event.ctrlKey and selection
    node = selection.anchorNode.parentElement
    text = selection.toString()
    x = node.offsetLeft + node.offsetWidth
    y = node.offsetTop
    popover x, y, text

  else if event.which is 27
    removePopover()

