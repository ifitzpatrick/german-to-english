module.exports =
  create: (tag, attrs) ->
    ele = document.createElement tag
    for own key, value of attrs
      ele.setAttribute key, value

    return ele

