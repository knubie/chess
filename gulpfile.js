var gulp = require('gulp');
var gutil = require('gulp-util');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var connect = require('gulp-connect');
var jasmine = require('gulp-jasmine');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var notify = require('gulp-notify');

gulp.task('browserify', function() {
  appBundler = browserify({
    entries: './src/js/index.js',
    transform: [babelify],
    debug: true, // TODO use IS_DEV boolean
    cache: {},
    packageCache: {}
  });

  var rebundle = function() {
    var start = Date.now();
    gutil.log('Building browserify bundle');
    appBundler.bundle()
      .on('error', function(err) {
        notify.logLevel(0);
        notify.onError({
          title: 'Javascript compile error',
          message: err.message,
          sound: 'Sosumi'
        })(err);
        gutil.log(gutil.colors.red(err.message));
      })
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

gulp.task('sass', function() {
  gulp.src('./src/css/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./pub/css/'));
});

gulp.task('jasmine', function() {
 gulp.src('./spec/*-spec.js')
  .pipe(jasmine());
});

gulp.task('watch', function(){
  gulp.watch('./src/index.html', ['moveIndex']);
  gulp.watch('./src/css/*.scss', ['sass']);
  gulp.watch('./assets/**/*', ['moveAssets']);
  //gulp.watch('./src/js/*.js', ['jasmine']);
});

gulp.task('serve', function() {
  connect.server({
    root: 'pub/',
    host: '0.0.0.0',
    port: 1337
  });
});

gulp.task('default', ['browserify', 'moveAssets', 'moveIndex', 'sass', 'watch', 'serve']);
