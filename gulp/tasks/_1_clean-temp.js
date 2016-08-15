/**
 * Created by donmclean on 5/29/16.
 */
"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('clean-temp', () => {
        let deferred = config.vars.Q.defer();

        try {
            funcs.deletePath("temp", config.tempDir)
                .then(() => {
                    deferred.resolve();
                })
                .catch((err) => {
                    $.util.log($.util.colors.red(err));
                    funcs.gulpGlobalErrorHandler(err);
                    deferred.reject();
                });
        } catch (err) {
            $.util.log($.util.colors.red(err));
            funcs.gulpGlobalErrorHandler(err);
        }
        return deferred.promise;
    });
};