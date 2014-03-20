$ = (query) -> document.querySelectorAll query

try
  $("body")[0].insertAdjacentHTML "beforeend", template()
  angular.bootstrap $(".ged-popover")[0], ["Dict"]
catch e
  debugger

  #selection = document.getSelection()
  ##node = selection.anchorNode.parentElement
  #text = selection.toString()

  #popover.create text

#chrome.extension.onMessage.addListener (message, sender, callback) ->
#  if message.action is "open-german-english-dictionary"
#    openPopover()
#
#document.addEventListener "keydown", (event) ->
#  if event.which is 71 and event.altKey
#    openPopover()
#
#  else if event.which is 27
#    popover.replace()

