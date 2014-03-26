Dict.factory "searchSpanish", ($http, xmlToJson) ->
  (searchTerm) ->
    apiKey = "f70c5487-e263-407d-8f7a-9b3144e1ef82"
    url =
      "http://www.dictionaryapi.com/api/v1/references/spanish/xml/#{searchTerm.toLocaleLowerCase()}?key=#{apiKey}"

    $http.get(url).then (res) =>
      xml = res.data
      spec =
        name: "sections"
        selector: "entry"
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
