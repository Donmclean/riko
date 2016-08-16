"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('js-src', () => {

        let deferred = config.vars.Q.defer();

        if(config.vars._.isEmpty(config.js.src.src)) {
            deferred.resolve();
        } else {
            return gulp.src(config.js.src.src)
                .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
                .pipe($.if(!!funcs.customBuild.sourcemaps || funcs.isProd, $.sourcemaps.init()))
                .pipe($.babel({presets: ['babel-preset-react']}))
                .pipe($.include())
                .pipe($.debug({title: 'copying and minifying js srcs:'}))

                .pipe($.concat(config.js.src.mainFileName))
                .pipe($.rev())
                .pipe($.if(!!funcs.customBuild.sourcemaps && !funcs.customBuild.minifyJS, $.sourcemaps.write()))
                .pipe($.if(!!funcs.isCustom && !funcs.customBuild.minifyJS, gulp.dest(config.js.src.destDir)))
                .pipe($.size({showFiles: true}))
                .pipe($.if(!!funcs.customBuild.minifyJS || !!funcs.isProd, $.rename({suffix: '.min'})))
                // .pipe($.if(!!funcs.customBuild.minifyJS || !!funcs.isProd, $.uglify()))
                .pipe($.if(!!funcs.customBuild.minifyJS || !!funcs.isProd, $.size({showFiles:true})))
                .pipe($.if(!!funcs.customBuild.minifyJS && !!funcs.customBuild.sourcemaps || !!funcs.isProd, $.sourcemaps.write()))
                .pipe(gulp.dest(config.js.src.destDir));
        }

        return deferred.promise;

    });
};