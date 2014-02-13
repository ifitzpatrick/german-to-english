module.exports = (url) ->
  new Promise (resolve, reject) ->
    GM_xmlhttpRequest
      method: "GET"
      url: url
      onload: (res) ->
        resolve res

      onerror: (error) ->
        reject error


