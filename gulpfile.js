"use strict";
const
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')(),
    path    = require('path'),
    baseDir = path.resolve(__dirname);

const srcFiles = [
    baseDir+'/**/*.js',
    '!'+baseDir+'/bin/**',
    '!'+baseDir+'/node_modules/**'
];

gulp.task('lint', () => {
    return gulp.src(srcFiles)
        .pipe($.eslint({configFile: '.eslintrc' }))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.debug({title: 'linting js files:'}));
});