Dict.controller "RootCtrl", ($scope, chromeMessage, keydown, getSelection, search) ->
  $scope.reset = ->
    $scope.searchTerm       = ""
    $scope.nextSearchTerm   = ""
    $scope.previous         = []
    $scope.marker           = 0
    $scope.tree             = {sections: []}
    $scope.popoverIsVisible = false
    $scope.loading          = false

  $scope.reset()

  $scope.refresh = ->
    if $scope.previous.length < 0
      previousItem =
        searchTerm: ""
        tree: sections: []
    else
      previousItem      = $scope.previous[$scope.marker]
      $scope.searchTerm = previousItem.searchTerm
      $scope.tree       = previousItem.tree

  $scope.showPopover = (isVisible) ->
    $scope.popoverIsVisible = isVisible

    if isVisible
      searchTerm = getSelection()
      if searchTerm
        $scope.search searchTerm

  $scope.hasDefinitions = ->
    $scope.tree?.sections?.length > 0

  $scope.search = (searchTerm) ->
    $scope.loading    = true
    $scope.searchTerm = searchTerm

    search(searchTerm).then (tree) ->
      $scope.previous.unshift {searchTerm, tree}
      $scope.tree    = tree
      $scope.loading = false

    , (error) ->
      $scope.loading = false

  $scope.searchInput = (searchInputText) ->
    $scope.nextSearchTerm = ""
    $scope.search searchInputText
  
  $scope.canForward = ->
    $scope.marker > 0

  $scope.forward = ->
    if $scope.canForward()
      $scope.marker--
      $scope.refresh()

  $scope.canBack = ->
    $scope.marker < $scope.previous.length - 1

  $scope.back = ->
    if $scope.canBack()
      $scope.marker++
      $scope.refresh()

  $scope.close = ->
    $scope.showPopover false

  chromeMessage.listen ->
    $scope.showPopover true

  keydown.listen (event) ->
    if event.which is 71 and event.altKey
      $scope.showPopover true

    else if event.which is 27
      $scope.showPopover false

