module.exports = (url) ->
  new Promise (resolve, reject) ->
    xhr = new XMLHttpRequest()
    xhr.open("GET", url, true)
    xhr.onload = ->
      resolve xhr

    xhr.onerror = (error) ->
      reject error

    xhr.send()

