"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('lint-js-tests', () => {

        //Check for changed files
        let changedJSFiles = [];
        if(config.vars._.isEmpty(config.tests.changed)) {
            changedJSFiles = config.tests.all;
        } else {
            changedJSFiles = config.tests.changed;
            config.tests.changed = [];
        }

        let deferred = config.vars.Q.defer();

        if(config.vars._.isEmpty(config.tests.all)) {
            deferred.resolve();
        } else {
            return gulp.src(funcs.isWatching ? changedJSFiles : config.tests.all)
                .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
                .pipe($.eslint({configFile: config.eslintConfig}))
                .pipe($.eslint.format(funcs.eslintErrorHandler))
                .pipe($.eslint.failAfterError())
                .pipe($.jscs({configPath: config.jscsConfig}))
                .pipe($.jscs.reporter('fail'))
                .pipe($.debug({title: 'linting js test files:'}));
        }

        return deferred.promise;

    });
};