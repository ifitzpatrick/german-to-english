module.exports = (popover) ->
  tag: "form"
  events:
    submit: (event) ->
      searchBar = event.target.searchBar
      popover.create searchBar.value

      event.preventDefault?()
      return false

  children: [
    #arrow.left()
    #arrow.right()
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

