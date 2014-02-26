gulp       = require "gulp"
concat     = require "gulp-concat"
browserify = require "gulp-browserify"

gulp.task "default", ->
  gulp.src(["src/scripts/main.coffee"], read: false)
    .pipe(browserify(
      transform: ['coffeeify'],
      extensions: ['.coffee']
    ))
    .pipe(concat("index.js"))
    .pipe(gulp.dest("dest"))

