module.exports = (config) ->
  config.set
    basePath: "."
    frameworks: ["mocha", "browserify"]
    browsers: ["Chrome"]
    files: [
      "tests/**/*.spec.coffee"
    ]
    preprocessors:
      "**/*.coffee":             ["coffee"]
      "tests/**/*.spec.coffee":  ["browserify"]

    browserify:
      extensions: [".coffee", ".spec.coffee"]
      transform: ["coffeeify"]
      watch: true
      debug: true

    autoWatch: true
