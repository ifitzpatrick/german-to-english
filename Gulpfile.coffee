gulp       = require "gulp"
concat     = require "gulp-concat"
browserify = require "gulp-browserify"
stylus     = require "gulp-stylus"

gulp.task "default", ->
  gulp.src(["src/scripts/main.coffee"], read: false)
    .pipe(browserify(
      transform:  ["coffeeify"],
      extensions: [".coffee"]
    ))
    .pipe(concat("js/index.js"))
    .pipe(gulp.dest("dest"))

  gulp.src(["src/scripts/background.coffee"], read: false)
    .pipe(browserify(
      transform:  ["coffeeify"],
      extensions: [".coffee"]
    ))
    .pipe(concat("js/background.js"))
    .pipe(gulp.dest("dest"))

  gulp.src(["src/styles/main.styl"])
    .pipe(stylus())
    .pipe(concat("css/index.css"))
    .pipe(gulp.dest("dest"))

