gulp       = require "gulp"
coffee     = require "gulp-coffee"
concat     = require "gulp-concat"
stylus     = require "gulp-stylus"
jade       = require "gulp-jade"

build = ->
  # Popover js
  gulp.src([
    "src/scripts/module.coffee",
    "src/scripts/services/**/*.coffee",
    "src/scripts/controllers/**/*.coffee",
    "src/scripts/directives/**/*.coffee",
    "src/scripts/main.coffee"
  ])
    .pipe(coffee())
    .pipe(concat "js/index.js")
    .pipe(gulp.dest("dest"))

  # Options js
  gulp.src([
    "src/scripts/module.coffee",
    "src/scripts/services/**/*.coffee",
    "src/scripts/controllers/**/*.coffee",
    "src/scripts/directives/**/*.coffee",
    "src/scripts/options.coffee"
  ])
    .pipe(coffee())
    .pipe(concat "js/options.js")
    .pipe(gulp.dest("dest"))

  # Background script handles right click context menu
  gulp.src(["src/scripts/background.coffee"])
    .pipe(coffee())
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

  # Options template
  gulp.src(["src/templates/options.jade"])
    .pipe(jade())
    .pipe(concat "options.html")
    .pipe(gulp.dest("dest"))

gulp.task "default", -> build()


gulp.task "watch", ->
  gulp.watch(["src/**/*"], ["default"])
