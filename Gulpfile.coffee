gulp   = require "gulp"
coffee = require "gulp-coffee"
concat = require "gulp-concat"
es     = require "event-stream"

gulp.task "self", ->
  gulp.src("Gulpfile.coffee")
  gulp.dest("./")

gulp.task "default", ->
  es.concat(
    gulp.src(["header.js"]),
    gulp.src(["src/*.coffee"])
      .pipe(coffee())
  ).pipe(concat("index.js"))
    .pipe(gulp.dest("dest"))

