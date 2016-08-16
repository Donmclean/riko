"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('lint-gulp', () => {

        return gulp.src(config.gulpFiles)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.eslint({configFile: config.gulpESLINTConfig}))
            .pipe($.eslint.format(funcs.eslintErrorHandler))
            .pipe($.eslint.failAfterError())
            .pipe($.debug({title: 'linting gulp files:'}));
    });
};