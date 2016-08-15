"use strict";
module.exports = (gulp, $, config, funcs) => {
    gulp.task('run-selenium-tests', () => {
        funcs.isSeleniumTest = true;

        return gulp.src(config.tests.nightWatchConfig)
            .pipe($.plumber({errorHandler: funcs.gulpGlobalErrorHandler}))
            .pipe($.debug({title: 'running selenium tests:'}))
            // .pipe($.nightwatch({
            //     configFile: config.tests.nightWatchConfig,
            //     cliArgs: {
            //         env: 'chrome',
            //         verbose: true
            //     }
            // }))
            // .pipe($.nightwatch({
            //     configFile: './nightwatch.json',
            //     cliArgs: {
            //         env: 'firefox',
            //         verbose: true
            //     }
            // }))
            // .pipe($.nightwatch({
            //     configFile: './nightwatch.json',
            //     cliArgs: {
            //         env: 'safari',
            //         verbose: true
            //     }
            // }))
            .pipe($.nightwatch({
                configFile: './nightwatch.json',
                cliArgs: {
                    env: 'browserstack-chrome',
                    verbose: true
                }
            }));
        // .pipe($.nightwatch({
        //     configFile: './nightwatch.json',
        //     cliArgs: {
        //         env: 'browserstack-firefox',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: './nightwatch.json',
        //     cliArgs: {
        //         env: 'browserstack-safari',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: './nightwatch.json',
        //     cliArgs: {
        //         env: 'browserstack-ie10',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: './nightwatch.json',
        //     cliArgs: {
        //         env: 'browserstack-ie11',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: './nightwatch.json',
        //     cliArgs: {
        //         env: 'browserstack-ipad2',
        //         verbose: true
        //     }
        // }));
    });
};