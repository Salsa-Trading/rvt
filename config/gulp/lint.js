const gulp = require('gulp');
const tslint = require('gulp-tslint');
const jsonlint = require('gulp-jsonlint');
const sasslint = require('gulp-sass-lint');
const eslint = require('gulp-eslint');

gulp.task('lint', ['tslint', 'jsonlint', 'sasslint', 'eslint']);

gulp.task('sasslint', () =>
  gulp.src([
    'src/**/*.s+(a|c)ss',
    '!node_modules/**/*'
  ])
  .pipe(sasslint())
  .pipe(sasslint.format())
  .pipe(sasslint.failOnError())
);

gulp.task('eslint', () =>
  gulp.src([
    '**/*.js',
    '!docs/public/vendor/**/*',
    '!lib/**/*',
    '!node_modules/**/*'
  ])
  .pipe(eslint())
  .pipe(eslint.formatEach('compact', process.stderr))
);

gulp.task('jsonlint', () =>
  gulp.src([
    '**/*.json',
    '!node_modules/**/*'
  ])
  .pipe(jsonlint())
  .pipe(jsonlint.reporter())
);

gulp.task('tslint', () =>
  gulp
  .src([
    'src/**/*.ts',
    'src/**/*.tsx',
    '!node_modules/**/*'
  ])
  .pipe(tslint({
    formatter: 'verbose'
  }))
  .pipe(tslint.report({
    summarizeFailureOutput: true
  }))
);
