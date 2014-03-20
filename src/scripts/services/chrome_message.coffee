Dict.factory "chromeMessage", ($rootScope) ->
  listen: (fn) ->
    chrome.extension.onMessage.addListener (message, sender, callback) ->
      if message.action is "open-german-english-dictionary"
        $rootScope.$apply ->
          fn()

