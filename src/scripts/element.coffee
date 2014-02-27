module.exports =
  create: (tag="div", attrs={}) ->
    ele = document.createElement tag
    for own key, value of attrs
      ele.setAttribute key, value

    return ele

