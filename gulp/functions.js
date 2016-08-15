"use strict";

module.exports = (gulp, $, config) => {
    const funcs = {};

    funcs.args = process.argv.slice(3);
    funcs.isProd = false;
    funcs.isDev = false;
    funcs.isCustom = false;
    funcs.isWatching = false;
    funcs.isUnitTest = false;
    funcs.isSeleniumTest = false;
    funcs.unitTestPassed = false;
    funcs.seleniumTestPassed = false;
    funcs.minifyImages = false;

    funcs.runServer = false;

    funcs.errors = [];
    funcs.errorExitCode = 0;
    funcs.exitOnGulpGlobalErrors = false;

    funcs.customBuild = {};

    funcs.test = () => {

        config.vars.logi.log("in functions", 'test?');
        return 'working';
    };

    funcs.processGulpArgs = args => {
        let deferred = config.vars.Q.defer();

        config.vars.logi.info("processing gulp arguments...", args);

        config.vars._.forEach(args, (arg, i) => {
            switch (arg) {
                case '--a': {
                    config.vars.logi.warning('build will now add autoprefixing to sass/css files...');
                    funcs.customBuild.autoprefix = true;
                    break;
                }
                case '--m': {
                    config.vars.logi.warning('build will now minify files...');
                    funcs.customBuild.minifySASS = true;
                    funcs.customBuild.minifyJS = true;
                    break;
                }
                case '--mi': {
                    config.vars.logi.warning('build will now minify images...');
                    funcs.minifyImages = true;
                    break;
                }
                case '--s': {

                    config.vars.logi.warning('build will now serve files on port', config.EXPRESS_PORT);
                    funcs.runServer = true;
                    break;
                }
                case '--sm': {
                    config.vars.logi.warning('build will now add sourcemaps to files...');
                    funcs.customBuild.sourcemaps = true;
                    break;
                }
            }

            if(i === args.length -1) {
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    funcs.runGulpTaskParallel = tasks => {
        return gulp.parallel(tasks);
    };

    funcs.runGulpTaskSeries = tasks => {
        return gulp.series(tasks);
    };

    funcs.runGulpTaskCustom = (condition, task) => {
        if(!!condition) {
            return gulp.series(task);
        } else {
            return 'noop';
        }

    };

    funcs.gulpGlobalErrorHandler = err => {
        if(!!err) {
            funcs.errors.push(err);
            funcs.errorExitCode = 1;
        }

        config.vars.logi.info('funcs.errorExitCode:',funcs.errorExitCode);

        if(funcs.exitOnGulpGlobalErrors) {
            config.vars.exec(process.exit(funcs.errorExitCode));
        }

    };

    funcs.logEslintErrors = (error) => {
        $.util.log($.util.colors.cyan(`Error:`) + $.util.colors.red(` ${config.vars.path.basename(error.filePath)}`));
        config.vars._.forEach(error.messages, (message) => {

            $.util.log($.util.colors.cyan(` - on - `) + $.util.colors.yellow(`line:`)+ $.util.colors.red(` ${message.line}`)+
                $.util.colors.yellow(` col: `) + $.util.colors.red(`${message.column}`) +
                $.util.colors.cyan(` Reason:`) + $.util.colors.red(` ${message.message}`)+ $.util.colors.cyan(` ---> `)+ $.util.colors.yellow(`${message.source.trim()}`));
        });
    };

    funcs.eslintErrorHandler = (errors) => {

        if(errors.errorCount > 0) {
            config.vars.beep();

            $.util.log($.util.colors.red("................. : ..................."));
            config.vars._.forEach(errors, (error) => {
                if(error.errorCount || error.warningCount > 0) {
                    funcs.logEslintErrors(error);
                }
            });
            $.util.log($.util.colors.red("................. : ..................."));
            $.util.log($.util.colors.bgRed.grey(`........... ${$.util.colors.yellow(errors.errorCount)} Errors Found! ..........`));
        }

    };

    funcs.jshintErrorHandler = (err, doExit) => {

        if(!!doExit) {
            config.vars.beep(3);
        } else {
            config.vars.beep();
        }

        $.util.log($.util.colors.red("................. : ..................."));
        config.vars._.forEach(err, (err) => {
            $.util.log($.util.colors.cyan(`Error:`) + $.util.colors.red(` ${err.file}`) +
                $.util.colors.cyan(` - on - `) + $.util.colors.yellow(`line:`)+ $.util.colors.red(` ${err.error.line}`)+
                $.util.colors.yellow(` col: `) + $.util.colors.red(`${err.error.character}`) +
                $.util.colors.cyan(` Reason:`) + $.util.colors.red(` ${err.error.reason}`)+ $.util.colors.cyan(` ---> `)+ $.util.colors.yellow(`${err.error.evidence}`));
        });
        $.util.log($.util.colors.red("................. : ..................."));

        if(!!doExit) {
            config.vars.exec(process.exit(1));
        }

    };

    funcs.sassErrorHandler = err => {
        config.vars.beep();
        $.util.log($.util.colors.red("................. : ..................."));
        $.util.log($.util.colors.yellow(`Error in file (${$.util.colors.red(err.message.split('\n')[0])})`));
        $.util.log($.util.colors.yellow(`Plugin: (${$.util.colors.blue(err.plugin)})`));
        $.util.log($.util.colors.yellow(`on line ${$.util.colors.red(err.line)} column ${$.util.colors.red(err.column)}`));
        $.util.log($.util.colors.red(err.formatted));
        $.util.log($.util.colors.red("................. : ..................."));
        config.vars.exec(process.exit(1));
    };

    funcs.cssLintErrorHandler = file => {
        $.util.log($.util.colors.red("................. : ..................."));

        if(file.csslint.errorCount === 1) {
            $.util.log($.util.colors.yellow(file.csslint.errorCount)+' error in '+$.util.colors.blue(file.path));
        } else {
            $.util.log($.util.colors.yellow(file.csslint.errorCount)+' errors in '+$.util.colors.blue(file.path));
        }

        file.csslint.results.forEach(function(result) {
            $.util.log($.util.colors.yellow(`${config.vars._.capitalize(result.error.type)} in file (${$.util.colors.red(result.file)})`));
            $.util.log($.util.colors.red($.util.colors.yellow(`Message:`),result.error.message.split('at')[0]) + $.util.colors.yellow(`on line ${$.util.colors.red(result.error.line)} column ${$.util.colors.red(result.error.col)}`));
        });
        $.util.log($.util.colors.red("................. : ..................."));

    };

    funcs.startUnitTests = (singleRun, autoWatch) => {
        let called = false,
            Server = require('karma').Server,
            excludes = config.tests.karmaConfig.exclude,
            deferred = config.vars.Q.defer();

        let server = new Server(config.vars._.assign(
            {configFile: config.tests.karmaConfigFile},
            {singleRun: !!singleRun},
            {autoWatch: !!autoWatch},
            {exclude: excludes}
        ), results => {
            if(!called) {
                called = true;

                if(results === 0) {
                    funcs.unitTestPassed = true;
                    config.vars.logi.info("Karma Unit Tests Passed");
                    deferred.resolve();

                } else {
                    funcs.unitTestPassed = false;
                    config.vars.logi.error("Karma Unit Tests Failed");
                    config.vars.beep(2);

                    if(funcs.exitOnGulpGlobalErrors) {
                        config.vars.exec(process.exit(results));
                        deferred.reject(results);
                    }

                    deferred.resolve(results);
                }
            }
            return deferred.promise;
        });

        server.start();
        server.on('browser_error', (err) => {
            config.vars.logi.error('ERROR:', err);

        });

        return deferred.promise;
    };

    funcs.delete = (name, file) => {
        let deferred = config.vars.Q.defer();
        try {
            $.util.log($.util.colors.red(`Cleaning ${name}: `, file));

            config.vars.qfs.remove(file)
                .then(() => {
                    $.util.log($.util.colors.red(`${file} removed...`));
                })
                .then(() => {
                    deferred.resolve();
                })
                .catch((err) => {
                    $.util.log($.util.colors.red(err));
                    deferred.reject();
                });

        } catch (err) {
            $.util.log($.util.colors.red(err));
        }
        return deferred.promise;
    };

    funcs.deletePath = (name, path) => {
        let deferred = config.vars.Q.defer();

        config.vars.qfs.isDirectory(path).then((exists) => {
            if(exists) {
                try {
                    $.util.log(`Cleaning ${$.util.colors.red(name)} directory: `, $.util.colors.blue(path));

                    config.vars.qfs.removeTree(path)
                        .then(() => {
                            $.util.log(`${$.util.colors.red(name)} directory removed...`);
                        }).then(() => {
                        deferred.resolve();
                    }).catch((err) => {
                        $.util.log($.util.colors.red(err));
                        deferred.reject();
                    });
                } catch (err) {
                    $.util.log($.util.colors.red(err));
                }
            } else {
                $.util.log(`${$.util.colors.red(name)} directory does not exist...`);
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    funcs.jsWebSrcInjector = () => {

        let jsWebSrcs = config.vars._.concat(config.js.deps.webSrcs, config.js.src.webSrcs);

        let tags = config.vars._.map(jsWebSrcs, (link) => {
            $.util.log("Adding js web source:",$.util.colors.blue(link));
            return `<script src="${link}" type="text/javascript"></script>`;
        });
        return tags.join('');
    };

    funcs.cssWebSrcInjector = () => {

        let cssWebSrcs = config.vars._.concat(config.css.deps.webSrcs, config.css.src.webSrcs);

        let tags = config.vars._.map(cssWebSrcs, (link) => {
            $.util.log("Adding css web source:",$.util.colors.blue(link));
            return `<link href="${link}" type="text/css" rel="stylesheet">`;
        });
        return tags.join('');
    };

    funcs.logChangedFile = path => {
        config.vars.logi.mixed([{
            color: 'yellow',
            value: "Changed File:"
        },{
            color: 'blue',
            value: config.vars.path.basename(path)
        }]);
    };

    return funcs;
};