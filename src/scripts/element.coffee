module.exports =
  create: (options={}) ->
    options.tag ?= "div"
    ele = document.createElement options.tag

    for own key, value of options?.attrs or {}
      ele.setAttribute key, value

    if options.text?
      ele.innerText = options.text

    if options.html?
      ele.innerHTML = options.html

    for event in options.events or []
      ele.addEventListener event.type, event.handler

    for child in options.children or []
      ele.appendChild @create child

    options.onCreate? ele

    return ele

