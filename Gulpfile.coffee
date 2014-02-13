gulp        = require "gulp"
concat      = require "gulp-concat"
browserify  = require "gulp-browserify"
streamqueue = require "streamqueue"

gulp.task "default", ->
  streamqueue({objectMode: true},
    gulp.src(["header.js"]),
    gulp.src(["src/main.coffee"], read: false)
      .pipe(browserify(
        transform: ['coffeeify'],
        extensions: ['.coffee']
      ))
  ).pipe(concat("index.js"))
    .pipe(gulp.dest("dest"))

