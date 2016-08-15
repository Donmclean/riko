"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('css-deps', () => {

        let deferred = config.vars.Q.defer();

        if(config.vars._.isEmpty(config.css.deps.src)) {
            deferred.resolve();
        } else {
            return gulp.src(config.css.deps.src)
                .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
                .pipe($.if(!!funcs.customBuild.sourcemaps || !!funcs.isProd, $.sourcemaps.init()))
                .pipe($.debug({title: 'copying and minifying css deps:'}))
                .pipe($.concat(config.css.deps.mainFileName))
                .pipe($.rev())
                .pipe($.if(!!funcs.customBuild.autoprefix || !!funcs.isDev || !!funcs.isProd, $.autoprefixer()))
                .pipe($.if(!funcs.customBuild.minifySASS && !!funcs.customBuild.sourcemaps || !!funcs.isDev || !!funcs.isProd, $.sourcemaps.write()))
                .pipe($.if(!!funcs.isCustom && !funcs.customBuild.minifySASS, gulp.dest(config.sass.destDir)))
                .pipe($.size({showFiles:true}))
                .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.cleanCss()))
                .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.rename({suffix: '.min'})))
                .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.size({showFiles:true})))
                .pipe($.if(!!funcs.customBuild.minifySASS && !!funcs.customBuild.sourcemaps || !!funcs.isProd, $.sourcemaps.write()))
                .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, gulp.dest(config.sass.destDir)));
        }

        return deferred.promise;
    });
};