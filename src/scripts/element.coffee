module.exports =
  create: (tag, styles) ->
    ele = document.createElement tag
    for own key, value of styles
      ele.style[key] = value

    return ele

