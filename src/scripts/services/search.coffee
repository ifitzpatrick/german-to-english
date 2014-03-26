Dict.factory "search", (searchGerman, searchSpanish) ->
  (searchTerm, language) ->
    dictionaries =
      german: searchGerman
      spanish: searchSpanish

    dictionaries[language] searchTerm
