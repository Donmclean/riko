"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('audio', () => {

        return gulp.src(config.media.audio.src)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.debug({title: 'copying audio files:'}))
            .pipe($.if(!!funcs.isDev, gulp.dest(config.media.audio.tempDir)))
            .pipe($.if(!funcs.isDev, gulp.dest(config.media.audio.destDir)));

    });
};