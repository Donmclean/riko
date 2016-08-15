"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('sass', () => {

        let deferred = config.vars.Q.defer();
        let isCssOnly = false;
        let noStyles = config.vars._.isEmpty(config.sass.src) && config.vars._.isEmpty(config.css.src.src);

        if(noStyles) {
            deferred.resolve();
        } else if(!config.vars._.isEmpty(config.css.src.src) && config.vars._.isEmpty(config.sass.src)) {
            isCssOnly = true;
        }

        return noStyles ? deferred.promise : gulp.src(!isCssOnly ? config.sass.src : config.css.src.src)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.if(!!funcs.customBuild.sourcemaps || !!funcs.isDev || !!funcs.isProd, $.sourcemaps.init()))
            .pipe($.if(!isCssOnly, $.sass().on('error', funcs.sassErrorHandler)))
            .pipe($.if(!isCssOnly, $.addSrc.append(config.css.src.src)))
            .pipe($.csslint())
            .pipe($.csslint.reporter(funcs.cssLintErrorHandler))
            .pipe($.debug({title: 'copying and minifying sass/css:'}))
            .pipe($.concat(config.sass.mainFileName))
            .pipe($.if(!!funcs.customBuild.autoprefix || !!funcs.isDev || !!funcs.isProd, $.autoprefixer()))
            .pipe($.if(!funcs.isDev && !funcs.isWatching,$.rev()))
            .pipe($.if(!funcs.customBuild.minifySASS && !!funcs.customBuild.sourcemaps || !!funcs.isDev || !!funcs.isProd, $.sourcemaps.write()))
            .pipe($.if(!!funcs.isDev, gulp.dest(config.tempDir)))
            .pipe($.if(!!funcs.isCustom && !funcs.customBuild.minifySASS, gulp.dest(config.sass.destDir)))
            .pipe($.size({showFiles:true}))
            .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.rename({suffix: '.min'})))
            .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.cleanCss()))
            .pipe($.if(!!funcs.customBuild.minifySASS && !!funcs.customBuild.sourcemaps || !!funcs.isProd, $.sourcemaps.write()))
            .pipe($.if(!!funcs.customBuild.minifySASS || !!funcs.isProd, $.size({showFiles:true})))
            .pipe($.if(!!funcs.isCustom || !!funcs.isProd, gulp.dest(config.sass.destDir)));

    });
};