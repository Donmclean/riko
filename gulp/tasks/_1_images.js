"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('images', () => {

        return gulp.src(config.media.images.src)
            .pipe($.if(!!funcs.minifyImages, $.debug({title: 'copying & minifying images:'}), $.debug({title: 'copying images:'})))
            .pipe($.if(!!funcs.minifyImages, $.imagemin({
                progressive: true,
                use: [config.vars.pngquant()]
            })))
            .pipe($.if(!!funcs.isDev, gulp.dest(config.media.images.tempDir)))
            .pipe($.if(!funcs.isDev, gulp.dest(config.media.images.destDir)));

    });
};