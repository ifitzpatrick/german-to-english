gulp       = require "gulp"
concat     = require "gulp-concat"
browserify = require "gulp-browserify"
stylus     = require "gulp-stylus"

gulp.task "default", ->
  # Popover js
  gulp.src(["src/scripts/main.coffee"], read: false)
    .pipe(browserify(
      transform:  ["coffeeify"],
      extensions: [".coffee"]
    ))
    .pipe(concat "js/index.js")
    .pipe(gulp.dest("dest"))

  # Background script handles right click context menu
  gulp.src(["src/scripts/background.coffee"], read: false)
    .pipe(browserify(
      transform:  ["coffeeify"],
      extensions: [".coffee"]
    ))
    .pipe(concat "js/background.js")
    .pipe(gulp.dest("dest"))

  # Framework
  gulp.src(["vendor/angular.min.js"])
    .pipe(concat "js/vendor.js")
    .pipe(gulp.dest("dest"))

  # Styles
  gulp.src(["src/styles/main.styl"])
    .pipe(stylus())
    .pipe(concat "css/index.css")
    .pipe(gulp.dest("dest"))

  # Popover template
  gulp.src(["src/templates/popover.jade"])
    .pipe(jade client: true)
    .pipe(concat "js/templates.js")
    .pipe(gulp.dest("dest"))

