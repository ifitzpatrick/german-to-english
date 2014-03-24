$ = (query) -> document.querySelectorAll query

try
  $("body")[0].insertAdjacentHTML "beforeend", template()
  angular.bootstrap $(".ged-popover")[0], ["Dict"]
catch e
  debugger

