arrow = require "./arrow"

module.exports =
  (popover, arrowActiveColor="white", arrowDisabledColor="#bbb") ->
    leftArrow = arrow.left(20, arrowActiveColor, arrowDisabledColor,
      events:
        click: -> popover.back()
    )

    rightArrow = arrow.right(20, arrowActiveColor, arrowDisabledColor,
      events:
        click: -> popover.forward()
    )

    tag: "form"
    events:
      submit: (event) ->
        searchBar = event.target.searchBar
        popover.create searchBar.value

        event.preventDefault?()
        return false

    children: [
      leftArrow
      rightArrow
      tag: "input"
      attrs:
        name: "searchBar"

    ,
      tag: "button"
      text: "Search"
      attrs:
        type: "submit"

    ,
      attrs:
        class: "ged-popover-close"

      html: "&times;"
      events:
        click: -> popover.replace()

    ]
    arrowActiveColor:   "white"
    arrowDisabledColor: "#bbb"
    update: (leftActive, rightActive) ->
      leftArrow.update leftActive
      rightArrow.update rightActive

