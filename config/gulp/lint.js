const gulp = require('gulp');
const gulpJsonlint = require('gulp-jsonlint');
const gulpSassLint = require('gulp-sass-lint');
const gulpEslint = require('gulp-eslint');

const lint = gulp.series(eslint, jsonlint, sasslint);

function sasslint() {
  return gulp
    .src([
      'src/**/*.s?(a|c)ss',
      '!node_modules/**/*'
    ])
    .pipe(gulpSassLint())
    .pipe(gulpSassLint.format())
    .pipe(gulpSassLint.failOnError())
 };

function eslint() {
  return gulp
    .src([
      'src/**/*.ts',
      'src/**/*.tsx',
      'test/**/*.ts',
      'test/**/*.tsx',
      '**/*.js',
      '!docs/public/vendor/**/*',
      '!lib/**/*',
      '!node_modules/**/*'
    ])
    .pipe(gulpEslint())
    .pipe(gulpEslint.formatEach('compact', process.stderr))
}

function jsonlint() {
  return gulp
    .src([
      '**/*.json',
      '!node_modules/**/*'
    ])
    .pipe(gulpJsonlint())
    .pipe(gulpJsonlint.reporter())
}

exports.lint = lint;
exports.jsonlint = jsonlint;
exports.eslint = eslint;
exports.sasslint = sasslint;