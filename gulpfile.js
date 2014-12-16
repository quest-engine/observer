
var gulp  = require('gulp'),
  bump    = require('gulp-bump'),
  paths   = {};

paths.pkgs = [
  './package.json',
  './bower.json'
];

gulp.task('bump', function () {
  return gulp.src(paths.pkgs)
    .pipe(bump())
    .pipe(gulp.dest('./'));
});

gulp.task('bump:minor', function () {
  return gulp.src(paths.pkgs)
    .pipe(bump({type: 'minor'}))
    .pipe(gulp.dest('./'));
});

gulp.task('bump:major', function () {
  return gulp.src(paths.pkgs)
    .pipe(bump({type: 'major'}))
    .pipe(gulp.dest('./'));
});