Dict.factory "searchGerman", ($http, xmlToJson) ->
  (searchTerm) ->
    url =
      "http://dict.leo.org/dictQuery/m-vocab/ende/query.xml?search=#{searchTerm}"

    $http.get(url).then (res) =>
      xml = res.data
      spec =
        name: "sections"
        selector: "section"
        attrs:
          name: "sctTitle"

        children: [
          name: "definitions"
          selector: "entry"
          children: [
            name: "langs"
            selector: "side"
            attrs:
              lang: "lang"

            text: true
          ]
        ]

      xmlToJson xml, spec
