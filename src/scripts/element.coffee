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

    for own eventType, eventHandler of options.events or {}
      ele.addEventListener eventType, eventHandler

    for child in options.children or []
      ele.appendChild @create child

    options.onCreate? ele

    return ele

