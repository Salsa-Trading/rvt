'use strict';
const gulp = require('gulp');
const watch = require('gulp-watch');
const del = require('del');
const ts = require('gulp-typescript');
const sass = require('gulp-sass')(require('sass'));
const merge2 = require('merge2');

function clean(done) {
  del(['./lib/**', './css/**']).then(() => done());
};

const tsProject = ts.createProject('./tsconfig.json');

function build() {
  const tsResult = gulp.src('./src/**/*.{ts,tsx}')
    .pipe(tsProject());

  return merge2(
    tsResult.dts.pipe(gulp.dest('lib')),
    tsResult.js.pipe(gulp.dest('lib'))
  );
};

function compileSass() {
  return gulp.src('./scss//**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
}

const deploy = gulp.series(clean, build, compileSass);
const deployNoClean = gulp.series(build, compileSass);

const dev = gulp.series(
  clean,
  build,
  compileSass,
  () => watch('**/*.tsx', (events, done) => {
    gulp.run('deploy-no-clean');
  })
);

exports.clean = clean;
exports.build = build;
exports.compileSass = compileSass;
exports.deploy = deploy;
exports.deployNoClean = deployNoClean;
exports.dev = dev;