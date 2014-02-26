module.exports = (config) ->
  config.set
    basePath: "."
    frameworks: ["jasmine"]
    browsers: ["Chrome"]
    files: [
      "dest/index.js"
      "test/**/*.spec.coffee"
    ],
