'use strict';
const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const sass = require('gulp-sass');
const merge2 = require('merge2');

function logError(err) {
  console.error(err);
}

gulp.task('clean', (done) => {
  del(['./lib/**', './scss/**', './css/**']).then(() => done());
});

const tsProject = ts.createProject('./tsconfig.json');

gulp.task('build', () => {
  const tsResult = gulp.src('./src/**/*.{ts,tsx}')
    .pipe(tsProject());

  return merge2(
    tsResult.dts.pipe(gulp.dest('lib')),
    tsResult.js.pipe(gulp.dest('lib'))
  );
  return 
});

gulp.task('sass', function () {
  return gulp.src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('copy-assets', ['clean'], () => {
  return merge2(
    gulp.src(['src/styles/**.scss']).pipe(gulp.dest('./scss/'))
  );
});

gulp.task('deploy', ['clean', 'build', 'sass', 'copy-assets'],  () => {

});
