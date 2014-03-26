Dict.factory "chromeMessage", ($rootScope) ->
  listen: (fn) ->
    chrome.extension.onMessage.addListener (message, sender, callback) ->
      if message.action is "open-german-english-dictionary"
        $rootScope.$apply ->
          console.log "omg"
          fn "german"

      if message.action is "open-spanish-english-dictionary"
        $rootScope.$apply ->
          console.log "lol"
          fn "spanish"
