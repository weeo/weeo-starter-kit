const gulp = require('gulp');
const gulpif = require('gulp-if');
// const sitemap = require('gulp-sitemap');
const stylus = require('gulp-stylus');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const autoprefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const cleanCSS = require('gulp-clean-css');
const connect = require('gulp-connect');
const removeEmptyLines = require('gulp-remove-empty-lines');
const minimist = require('minimist');
const babel = require('gulp-babel');
const bootstrap = require('bootstrap-styl');
const imagemin = require('gulp-imagemin');
const rimraf = require('rimraf');
// const webpack = require('gulp-webpack');
const webpack = require('webpack-stream');

// ---------------------------------------------
// コマンドラインの入力を解析
// ---------------------------------------------

const knownOptions = {
  string: 'env',
  default: {env: 'development'}
};
const options = minimist(process.argv.slice(2), knownOptions);
const isProduction = (options.env === 'production') ? true : false;
const isStaging = (options.env === 'staging') ? true : false;
const isDevelopment = (options.env === 'development') ? true : false;

// 環境変数セット
process.env.NODE_ENV = options.env
const webpackConfig = require('./webpack.config.js');

// ---------------------------------------------
// localhostサーバー
// ---------------------------------------------

gulp.task('serve', function(done) {
  connect.server({
    root: 'public',
    livereload: true,
  });
});


// ---------------------------------------------
// build タスク
// ---------------------------------------------

gulp.task('clean', function(cb) {
  return rimraf('./public/!(components)**', cb);
});

gulp.task('pug', function() {
  return gulp.src('./src/**/index.pug')
    .pipe(plumber())
    .pipe(pug({
      basedir: './node_modules/weeo/pug/',
      pretty: true,
      data: {
        isProduction: isProduction,
        isStaging: isStaging,
        isDevelopment: isDevelopment
      }
    }))
    .pipe(gulp.dest('./public/'))
    .pipe(gulpif(isDevelopment, connect.reload()));
});

gulp.task('stylus', function() {
  return gulp.src('./src/_styl/**/!(_)*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: bootstrap()
    }))
    .pipe(autoprefixer({browsers: ['last 4 versions']}))
    .pipe(cleanCSS())
    .pipe(gulp.dest('./public/css/'))
    .pipe(gulpif(isDevelopment, connect.reload()));
});

gulp.task('webpack', function () {
  return gulp.src(['./src/_js/**/*.ts'])
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('./public/js/'))
    .pipe(gulpif(isDevelopment, connect.reload()));
});

gulp.task('img', function() {
  gulp.src('./src/_img/**/*')
    .pipe(plumber())
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./public/img/'))
    .pipe(gulpif(isDevelopment, connect.reload()));
});


// ---------------------------------------------
// フォルダ監視
// ---------------------------------------------

gulp.task('watch', function() {
  gulp.watch('./src/**/*.pug', ['pug']);
  // gulp.watch('./src/**/*.md', ['pug']);
  gulp.watch('./src/_styl/**/*.styl', ['stylus']);
  gulp.watch('./src/_js/**/*.vue', ['webpack']);
  gulp.watch('./src/_js/**/*.js', ['webpack']);
  // gulp.watch('./src/_img/**/*.[png|jpg|gif]', ['img']);
  return;
});

gulp.task('build', ['clean'], function() {
  return gulp.start([
    'pug',
    'stylus',
    'webpack',
    'img'
  ]);
});

gulp.task('default', ['serve', 'watch']);
