'use strict';
const gulp = require('gulp');
const watch = require('gulp-watch');
const del = require('del');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
const merge2 = require('merge2');

gulp.task('clean', (done) => {
  del(['./lib/**', './css/**']).then(() => done());
});

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', () => {
  const tsResult = gulp.src('./src/**/*.{ts,tsx}')
    .pipe(tsProject());

  return merge2(
    tsResult.dts.pipe(gulp.dest('lib')),
    tsResult.js.pipe(gulp.dest('lib'))
  );
});

gulp.task('sass', function () {
  return gulp.src('./scss//**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('deploy', ['clean', 'build', 'sass'],  () => {

});


gulp.task('deploy-no-clean', ['build', 'sass'],  () => {

});


gulp.task('dev', ['clean', 'build', 'sass'],  () => {
  return watch('**/*.tsx', (events, done) => {
    gulp.run('deploy-no-clean');
  });
});
