var gulp = require('gulp');
var gutil = require('gulp-util');

// Browserify
var watchify = require('watchify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');

gulp.task('browserify', function() {
  appBundler = browserify({
    entries: './src/js/index.js',
    debug: true, // TODO use IS_DEV boolean
    cache: {},
    packageCache: {}
  });

  var rebundle = function() {
    var start = Date.now();
    gutil.log('Building browserify bundle');
    appBundler.bundle()
      .on('error', function(err) { gutil.log(gutil.colors.red(err.message)); })
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(gulp.dest('./pub/js'))
      .on('end', function() {
        gutil.log('Browserify bundle built in ' + (Date.now() - start) +  'ms');
      });
      //.pipe(gutil.log('Browserify bundle built in ' + (Date.now() - start) +  'ms'));
      //.pipe(console.log('Browserify bundle built in ' + (Date.now() - start) +  'ms'));
  }

  // TODO use IS_DEV boolean
  appBundler = watchify(appBundler);
  appBundler.on('update', rebundle);

  rebundle();
});

gulp.task('moveIndex', function() {
  return gulp.src('./src/index.html').pipe(gulp.dest('./pub/'));
});

gulp.task('moveAssets', function() {
  return gulp.src('./assets/**/*').pipe(gulp.dest('./pub/assets/'));
});

gulp.task('watch', function(){
  gulp.watch('./src/index.html', ['moveIndex']);
  gulp.watch('./assets/**/*', ['moveAssets']);
});

gulp.task('serve', function() {
  connect.server({
    root: 'pub/',
    host: '0.0.0.0',
    port: 1337
  });
});

gulp.task('default', ['browserify', 'moveAssets', 'moveIndex', 'watch', 'serve']);
