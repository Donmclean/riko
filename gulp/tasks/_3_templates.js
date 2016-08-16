"use strict";
module.exports = (gulp, $, config, funcs) => {

    gulp.task('templates', () => {

        const
            Filter = $.filter(['**/*.css'], {restore: true}),
            obj = {};

        if(!!funcs.isProd || !!funcs.isCustom) {

            //Get JS Files
            obj.js = config.vars._.chain(config.vars.fs.readdirSync(config.js.src.destDir), config.vars.fs.readdirSync(config.js.deps.destDir))
                .concat()
                .uniq()
                .filter(file => () => {
                    if(!!funcs.isCustom) {
                        if(!!funcs.customBuild.minifyJS) {
                            return file.search('.min') > -1;
                        } else {
                            return file.search('.js') > -1;
                        }
                    } else {
                        return file.search('.min') > -1;
                    }})
                .value();

            //Get CSS Files
            obj.css = config.vars._.chain(config.vars.fs.readdirSync(config.css.src.destDir), config.vars.fs.readdirSync(config.css.deps.destDir))
                .concat()
                .uniq()
                .filter(file => () => {
                    if(!!funcs.isCustom) {
                        if(!!funcs.customBuild.minifyJS) {
                            return file.search('.min') > -1;
                        } else {
                            return file.search('.css') > -1;
                        }
                    } else {
                        return file.search('.min') > -1;
                    }})
                // .filter(file => file.search('.min') > -1)
                .value();

        }

        //Check for changed file
        let changedTemplateFile = [];
        if(config.vars._.isEmpty(config.templates.changed)) {
            changedTemplateFile = config.templates.src;
        } else {
            changedTemplateFile = config.templates.changed;
            config.templates.changed = [];
        }

        //Check if changed file is main index file
        let indexFileChanged = false;
        if(!config.vars._.isEmpty(changedTemplateFile)) {
            if(config.templates.main === changedTemplateFile[0] || config.templates.mainHTML === changedTemplateFile[0]) {
                indexFileChanged = true;
            }
        }

        //run if changed file is NOT main index file
        if(funcs.isWatching && !funcs.isCustom && indexFileChanged === false) {
            changedTemplateFile = changedTemplateFile[0];
            return gulp.src(changedTemplateFile)
                .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))

                //Parse changed file based on template type
                .pipe($.if(config.vars.path.extname(changedTemplateFile) === '.jade',$.jade()))

                .pipe($.debug({title: 'copying and minifying templates:'}))
                .pipe($.if(!!funcs.isDev || !!funcs.isCustom, gulp.dest(config.tempDir+changedTemplateFile.split(config.templates.srcDir)[1].split(config.vars.path.basename(changedTemplateFile))[0])))
                .pipe($.if(!funcs.isDev || !!funcs.isCustom, gulp.dest(config.templates.destDir+changedTemplateFile.split(config.templates.srcDir)[1].split(config.vars.path.basename(changedTemplateFile))[0])));
        } else {
            return gulp.src(config.templates.src)
                .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))

                //Parse & copy all templates *(Minus The Top Level Index File)*
                .pipe($.jade())
                .pipe($.addSrc(config.templates.srcHTML))

                .pipe($.debug({title: 'copying and minifying templates:'}))
                //Filter for Top level Index file
                .pipe(Filter)

                .pipe($.addSrc(config.templates.main))
                .pipe($.jade())
                .pipe($.addSrc(config.templates.mainHTML))
                .pipe($.debug({title: 'copying and minifying Top level templates:'}))
                .pipe($.if(!funcs.isDev, $.htmlmin({collapseWhitespace: true})))

                //Inject Module Files in Dev Mode
                .pipe($.if(!!funcs.isDev, $.inject(gulp.src(config.vars._.concat(config.js.deps.src, config.js.src.src, config.vendor.js.src)), {
                    addRootSlash: false,
                    addPrefix: '..'
                    // removeTags: true
                })), {read: false})

                .pipe($.if(!!funcs.isDev, $.inject(gulp.src(config.vars._.concat(config.css.deps.src, config.vendor.css.src, config.sass.tempSrc)), {
                    addRootSlash: false,
                    addPrefix: '..'
                    // removeTags: true
                })), {read: false})


                //For PROD OR CUSTOM
                .pipe(!!funcs.isProd || !!funcs.isCustom ? $.inject(gulp.src(config.vars._.map(obj.js, (file) => {
                    return config.js.deps.destDir + '/' + file;
                }),{read: false}), {
                    ignorePath: config.js.deps.destDir.split(process.cwd())[1],
                    addPrefix: config.sitePrefix + config.js.deps.destDir.split(config.destDir + '/')[1],
                    addRootSlash: false,
                    removeTags: true
                }) : $.util.noop())

                .pipe(!!funcs.isProd || !!funcs.isCustom ? $.inject(gulp.src(config.vars._.map(obj.css, (file) => {
                    return config.css.deps.destDir + '/' + file;
                }),{read: false}), {
                    ignorePath: config.css.deps.destDir.split(process.cwd())[1],
                    addPrefix: config.sitePrefix + config.css.deps.destDir.split(config.destDir + '/')[1],
                    addRootSlash: false,
                    removeTags: true
                }) : $.util.noop())


                //Inject Web Sources
                .pipe($.injectString.before('</body>',funcs.jsWebSrcInjector()))
                .pipe($.injectString.after('<head>',funcs.cssWebSrcInjector()))

                //Restore filtered templates
                .pipe(Filter.restore)

                .pipe($.if(!!funcs.isDev, gulp.dest(config.tempDir)))
                .pipe($.if(!funcs.isDev, gulp.dest(config.templates.destDir)));
        }

    });
};