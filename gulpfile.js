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
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                $.util.log('GULP PLUMBER > lint ERROR:', err);
            }
        }}))
        .pipe($.eslint({configFile: '.eslintrc' }))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.debug({title: 'linting js files:'}));
});