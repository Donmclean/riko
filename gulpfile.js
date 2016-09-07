const
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')(),
    config  = require('./webpack/config'),
    _v      = config.vars;

gulp.task('clean', function(done) {
    const dir = _v.path.basename(config.destDir);

    _v.qfs.removeTree(config.destDir)
        .then(() => {
            console.log(`'${_v.chalk.blue(dir)}' directory removed ${_v.chalk.green('successfully')}!`);
            done();
        })
        .catch(err => {
            switch (err.code) {
                case 'ENOENT': {
                    console.error(`the directory '${_v.chalk.red(dir)}' does not exist!`);
                    break;
                }
                default: {
                    console.error('error: ', err);
                    break;
                }
            }
            done();
        });
});

gulp.task('run-selenium-tests', () => {

    return gulp.src(config.nightWatchConfig)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                console.error('GULP PLUMBER > run-selenium-tests ERROR:', err);
            }
        }}))
        .pipe($.debug({title: 'running selenium tests:'}))
        // .pipe($.nightwatch({
        //     configFile: config.tests.nightWatchConfig,
        //     cliArgs: {
        //         env: 'chrome',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: config.nightWatchConfig,
        //     cliArgs: {
        //         env: 'firefox',
        //         verbose: true
        //     }
        // }))
        // .pipe($.nightwatch({
        //     configFile: config.nightWatchConfig,
        //     cliArgs: {
        //         env: 'safari',
        //         verbose: true
        //     }
        // }))
        .pipe($.nightwatch({
            configFile: config.nightWatchConfig,
            cliArgs: {
                env: 'browserstack-chrome',
                verbose: true
            }
        }));
    // .pipe($.nightwatch({
    //     configFile: config.nightWatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-firefox',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightWatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-safari',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightWatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ie10',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightWatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ie11',
    //         verbose: true
    //     }
    // }))
    // .pipe($.nightwatch({
    //     configFile: config.nightWatchConfig,
    //     cliArgs: {
    //         env: 'browserstack-ipad2',
    //         verbose: true
    //     }
    // }));
});