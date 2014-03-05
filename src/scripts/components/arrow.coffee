module.exports =
  buildElement: (width=20, activeColor="white", inactiveColor="#bbb", options={}, flip) ->
    canvasOptions =
      flip: flip
      tag: "canvas"
      attrs: do (width) ->
        width:  width
        height: width

      onCreate: (ele) ->
        @ele    = ele
        @active = false
        @redraw(ele, false, @flip)

      update: (active) ->
        @active = active
        @redraw(@ele, active, @flip)

      redraw: (ele, active, flip) =>
        ctx = ele.getContext "2d"
        color = if active then activeColor else inactiveColor
        @drawArrow ctx, width, color, flip

      events: {}

    for own key, value of options
      if key is "attrs" or key is "events"
        for own attrName, attrValue of value
          canvasOptions[key][attrName] = attrValue

      else
        canvasOptions[key] = value

    return canvasOptions

  drawArrow: (ctx, width, color, flip=false) ->
    ctx.clearRect 0, 0, width, width
    ctx.save()

    scale = (value) -> (width * (value/10))

    if flip
      ctx.translate width, 0
      ctx.scale -1, 1

    ctx.fillStyle = color

    ctx.beginPath()

    ctx.moveTo scale(9),  scale(0)

    ctx.lineTo scale(4),  scale(5)
    ctx.lineTo scale(9),  scale(10)
    ctx.lineTo scale(10), scale(10)
    ctx.lineTo scale(10), scale(9)
    ctx.lineTo scale(6),  scale(5)
    ctx.lineTo scale(10), scale(1)
    ctx.lineTo scale(10), scale(0)
    ctx.lineTo scale(9),  scale(0)

    ctx.fill()
    ctx.restore()

  left: (width, activeColor, inactiveColor, options) ->
    @buildElement width, activeColor, inactiveColor, options

  right: (width, activeColor, inactiveColor, options) ->
    @buildElement width, activeColor, inactiveColor, options, true

