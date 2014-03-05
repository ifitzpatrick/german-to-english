module.exports =
  buildElement: (width=20, afterDraw) ->
    tag: "canvas"
    attrs: do (width) ->
      width:  width
      height: width
    onCreate: (ele) ->
      ctx = ele.getContext "2d"
      @drawArrow ctx, width
      afterDraw?(ctx, width)

  drawArrow: (ctx, width) ->
    scale = (value) -> (width * (value/10))

    ctx.fillStyle = "black"

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

  flip: (ctx, width) ->
    ctx.scale 1, -1

  left: (width) ->
    @buildElement width

  right: (width) ->
    @buildElement width, @flip

