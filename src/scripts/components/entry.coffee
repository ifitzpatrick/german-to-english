module.exports = (search, tree) ->
  attrs:
    class: "ged-popover-content"

  children: [
    tag: "h1"
    text: search
  ,
    children: (for section in tree.sections
      do (section) ->
        attrs:
          class: "ged-popover-section"

        children: [
          tag: "h2"
          text: section.name
        ,
          tag: "table"
          children: (for definition in section.definitions
            do (definition) ->
              tag: "tr"
              children: (for lang in definition.langs
                do (lang) ->
                  tag: "td"
                  text: lang.text
              )
          )
        ]
    )
  ]