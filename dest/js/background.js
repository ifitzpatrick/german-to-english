(function() {
  chrome.contextMenus.create({
    title: "Lookup in german english dictionary",
    contexts: ["selection"],
    onclick: function() {
      return chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        return chrome.tabs.sendMessage(tabs[0].id, {
          action: "open-german-english-dictionary"
        }, function() {});
      });
    }
  });

  chrome.contextMenus.create({
    title: "Lookup in spanish english dictionary",
    contexts: ["selection"],
    onclick: function() {
      return chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tabs) {
        return chrome.tabs.sendMessage(tabs[0].id, {
          action: "open-spanish-english-dictionary"
        }, function() {});
      });
    }
  });

}).call(this);
