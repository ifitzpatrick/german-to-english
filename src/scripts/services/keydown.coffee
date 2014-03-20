Dict.factory "keydown", ($rootScope) ->
  listen: (fn) ->
    document.addEventListener "keydown", (event) ->
      $rootScope.$apply ->
        fn event

