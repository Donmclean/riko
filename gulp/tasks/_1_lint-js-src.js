"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('lint-js-src', () => {

        //Check for changed files
        let changedJSFiles = [];
        if(config.vars._.isEmpty(config.js.src.changed)) {
            changedJSFiles = config.js.src.src;
        } else {
            changedJSFiles = config.js.src.changed;
            config.js.src.changed = [];
        }

        let deferred = config.vars.Q.defer();

        if(config.vars._.isEmpty(config.js.src.src)) {
            deferred.resolve();
        } else {
            return gulp.src(funcs.isWatching ? changedJSFiles : config.js.src.src)
                .pipe($.eslint({configFile: config.eslintConfig}))
                .pipe($.eslint.format(funcs.eslintErrorHandler))
                .pipe($.eslint.failAfterError())
                .pipe($.debug({title: 'linting js src files:'}));
        }

        return deferred.promise;
    });
};