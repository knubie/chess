var gulp = require("gulp");

// Browserify
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

// Browserify maps js
var b = watchify(browserify({
  cache: {},
  packageCache: {},
  entries: ['./src/js/index.js'],
  debug: false
}));

gulp.task('browserify', bundle);
b.on('update', bundle);

function bundle() {
  return b.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./pub/js'));
}

gulp.task("watch", function(){
  bundle();
}
