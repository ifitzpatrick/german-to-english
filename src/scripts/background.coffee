chrome.contextMenus.create
  title: "Lookup in german english dictionary"
  contexts: ["selection"]
  onclick: ->
    chrome.tabs.query {active: true, currentWindow: true}, (tabs) ->
      chrome.tabs.sendMessage tabs[0].id,
        {action: "open-german-english-dictionary"}, ->

chrome.contextMenus.create
  title: "Lookup in spanish english dictionary"
  contexts: ["selection"]
  onclick: ->
    chrome.tabs.query {active: true, currentWindow: true}, (tabs) ->
      chrome.tabs.sendMessage tabs[0].id,
        {action: "open-spanish-english-dictionary"}, ->

