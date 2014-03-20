Dict.directive "arrow", ->
  restrict: "EA"
  replace: true
  scope:
    reverse: "=reverse"
    active:  "=active"

  template: """
    <canvas width="20" height="20"></canvas>
  """
  link: ($scope, element, attrs) ->
    activeColor   = "white"
    inactiveColor = "#bbb"
    width         = 20
    ctx           = element[0].getContext "2d"

    getColor = ->
      if $scope.active
        activeColor
      else
        inactiveColor

    draw = ->
      color = getColor()

      ctx.clearRect 0, 0, width, width
      ctx.save()

      scale = (value) -> (width * (value/10))

      if $scope.reverse
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

    $scope.$watch "active", ->
      draw()

    draw()

