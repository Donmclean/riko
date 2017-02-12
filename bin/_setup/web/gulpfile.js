"use strict";
const
    gulp        = require('gulp'),
    $           = require('gulp-load-plugins')(),
    gulpfile    = {};

const genericLog = (str, color) => {
    $.util.log($.util.colors[color || 'yellow'](str));
};

gulpfile.getConfigFile = () => {
    let config;
    try {
        config = require('./webpack/config');
    } catch (err) {
        genericLog(`${$.util.colors.red('ERROR:')} must have a valid ${$.util.colors.red('custom-config.js')} file in ${$.util.colors.blue('src/')} folder.`);
        genericLog(`Try running ${$.util.colors.blue('"npm run setup"')} to get started.`);
        throw new Error('must have a valid custom-config.js');
    }

    return config;
};

gulpfile.errorHandler = (err) => {
    if(err) {
        $.util.log('GULP PLUMBER > lint ERROR:', err);
    }
};

gulpfile.lint = (isLintBuild) => {
    const config = gulpfile.getConfigFile();

    return gulp.src(isLintBuild ? config.buildFiles : config.srcFiles)
        .pipe($.plumber({errorHandler: gulpfile.errorHandler}))
        .pipe($.eslint({configFile: isLintBuild ? './test-riko/.eslintrc.js' : './src/__linters/.eslintrc.js'}))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.debug({title: 'linting js files:'}));
};

gulp.task('lint-build', () => {
    return gulpfile.lint(true);

});

gulp.task('lint-src', () => {
    return gulpfile.lint(false);
});

gulp.task('run-selenium-tests', () => {
    const config = gulpfile.getConfigFile();
    return gulp.src(config.nightwatchConfig)
        .pipe($.plumber({errorHandler: gulpfile.errorHandler}))
        .pipe($.debug({title: 'running selenium tests:'}))

        //**********************
        //LOCAL BROWSER CONFIGS
        //**********************
        // .pipe($.nightwatch({
        //     configFile: config.nightwatchConfig,
        //     cliArgs: {
        //         env: 'chrome',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: config.nightwatchConfig,
        //     cliArgs: {
        //         env: 'firefox',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: config.nightwatchConfig,
        //     cliArgs: {
        //         env: 'safari',
        //         verbose: true
        //     }
        // }))

        //*********************
        //BROWSERSTACK CONFIGS
        //*********************
        .pipe($.nightwatch({
            configFile: config.nightwatchConfig,
            cliArgs: {
                env: 'browserstack-chrome',
                verbose: true
            }
        }));
    // .pipe($.nightwatch({
    //     configFile: config.nightwatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-firefox',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightwatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-safari',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightwatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ie10',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightwatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ie11',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightwatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ipad2',
    //         verbose: true
    //     }
    // }));
});

gulpfile.gulp = gulp;

module.exports = gulpfile;
