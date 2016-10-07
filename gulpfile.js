"use strict";
const
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')();

const handleMissingConfigFile = () => {
    try {
        require('./webpack/config');
    } catch (err) {
        $.util.log($.util.colors.red('ERROR:') + $.util.colors.yellow(' must have a valid custom-config.js file in ' +
            $.util.colors.red('src/') + ' folder. ') +
            $.util.colors.cyan('Try running '+ $.util.colors.blue('"npm run setup"')+' to get started.'));
        process.exit(0);
    }
};

gulp.task('setup', function (done) {
    const
        qfs     = require('q-io/fs'),
        _       = require('lodash'),
        baseDir = process.cwd(),
        srcDir  = baseDir+'/src',
        args    = process.argv;

    let srcToCopy;

    switch (args[3]) {
        case '--demo': {
            srcToCopy = '_demo-src';
            break;
        }
        case '--src': {
            srcToCopy = 'src';
            break;
        }
        default: {
            $.util.log(`${$.util.colors.red('invalid arg terminating...')}`);
            process.exit(0);
        }
    }

    $.util.log($.util.colors.yellow(`checking for existing ${$.util.colors.blue('src/')} folder...`));

    qfs.list(baseDir)
        .then(files => {
            if(_.includes(files, 'src')) {
                $.util.log($.util.colors.yellow(`${$.util.colors.blue('src/')} folder must not exist during setup. ${$.util.colors.red('terminating...')}`));
                process.exit(0);
            }
            $.util.log($.util.colors.yellow(`creating ${$.util.colors.blue('src/')} folder and sub directories`));
            return qfs.copyTree(baseDir+`/bin/_setup/${srcToCopy}`, srcDir);
        })
        .then(() => {
            $.util.log($.util.colors.yellow(`${$.util.colors.blue('src/')} folder created ${$.util.colors.green('successfully')}`));
            done();
        })
        .catch(err => {
            $.util.log(`${$.util.colors.red('ERROR: setting up src/ folder', err)}`);
            done();
        });
});

gulp.task('lint', function() {
    handleMissingConfigFile();

    const
        config  = require('./webpack/config');

    return gulp.src(config.buildFiles)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                $.util.log('GULP PLUMBER > lint ERROR:', err);
            }
        }}))
        .pipe($.eslint({configFile: './test-riko/.eslintrc'}))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());

});

gulp.task('run-selenium-tests', () => {
    handleMissingConfigFile();

    const
        config  = require('./webpack/config');

    return gulp.src(config.nightWatchConfig)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                $.util.log('GULP PLUMBER > run-selenium-tests ERROR:', err);
            }
        }}))
        .pipe($.debug({title: 'running selenium tests:'}))
        // .pipe($.nightwatch({
        //     configFile: config.nightWatchConfig,
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
