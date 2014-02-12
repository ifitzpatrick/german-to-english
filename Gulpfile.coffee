gulp        = require "gulp"
coffee      = require "gulp-coffee"
concat      = require "gulp-concat"
streamqueue = require "streamqueue"

gulp.task "default", ->
  streamqueue({objectMode: true},
    gulp.src(["header.js"]),
    gulp.src(["src/*.coffee"])
      .pipe(coffee())
  ).pipe(concat("index.js"))
    .pipe(gulp.dest("dest"))

