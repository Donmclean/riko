"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('videos', () => {

        return gulp.src(config.media.videos.src)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.debug({title: 'copying video files:'}))
            .pipe($.if(!!funcs.isDev, gulp.dest(config.media.videos.tempDir)))
            .pipe($.if(!funcs.isDev, gulp.dest(config.media.videos.destDir)));

    });
};