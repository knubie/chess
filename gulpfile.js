var gulp = require('gulp');

// Browserify
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');

// Browserify maps js
var b = watchify(browserify({
  cache: {},
  packageCache: {},
  entries: ['./src/js/index.js'],
  debug: true
}));

gulp.task('browserify', bundle);

b.on('update', bundle);

function bundle() {
  return b.bundle()
    .on('error', function(err) {
      console.log(err.message);
    })
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./pub/js'));
}

gulp.task('moveIndex', function() {
  return gulp.src('./src/index.html').pipe(gulp.dest('./pub/'));
});

gulp.task('watch', function(){
  gulp.watch('./src/index.html', ['moveIndex']);
});

gulp.task('serve', function() {
  connect.server({
    root: 'pub/',
    host: '0.0.0.0',
    port: 1337
  });
});

gulp.task('default', ['browserify', 'watch', 'serve']);
