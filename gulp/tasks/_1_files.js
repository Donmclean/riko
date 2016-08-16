"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('files', () => {

        return gulp.src(config.media.files.src)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.debug({title: 'copying other files:'}))
            .pipe($.if(!!funcs.isDev, gulp.dest(config.media.files.tempDir)))
            .pipe($.if(!funcs.isDev, gulp.dest(config.media.files.destDir)));

    });
};