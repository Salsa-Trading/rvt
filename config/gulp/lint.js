const gulp = require('gulp');
const {Linter} = require('tslint');
const gulpTslint = require('gulp-tslint');
const gulpJsonlint = require('gulp-jsonlint');
const gulpSassLint = require('gulp-sass-lint');
const gulpEslint = require('gulp-eslint');

const lint = gulp.series(tslint, jsonlint, sasslint, eslint);

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

function tslint() {
  const program = Linter.createProgram('./tsconfig.json');

  return gulp
    .src([
      'src/**/*.ts',
      'src/**/*.tsx',
      'test/**/*.ts',
      'test/**/*.tsx',
      '!node_modules/**/*'
    ])
    .pipe(gulpTslint({
      program: program,
      formatter: 'verbose'
    }))
    .pipe(gulpTslint.report({
      summarizeFailureOutput: true
    }));
}

exports.lint = lint;
exports.tslint = tslint;
exports.jsonlint = jsonlint;
exports.eslint = eslint;
exports.sasslint = sasslint;