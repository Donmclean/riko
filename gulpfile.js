"use strict";
const
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')();
//TODO: add gulp-util for all logs!.

const handleMissingConfigFile = () => {
    try {
        require('./webpack/config');
    } catch (err) {
        console.error('ERROR: must have a valid custom-config.js file in src/ folder.' +
            chalk.yellow('try running "npm run setup" to get started.'));
        process.exit(0);
    }
};

gulp.task('clean', function(done) {
    handleMissingConfigFile();

    const
        config  = require('./webpack/config'),
        _v      = config.vars,
        dir = _v.path.basename(config.destDir);

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

gulp.task('setup', function (done) {
    const
        qfs     = require('q-io/fs'),
        _       = require('lodash'),
        chalk   = require('chalk'),
        baseDir = process.cwd(),
        srcDir  = baseDir+'/src',
        args    = process.argv;

    let srcToCopy = '';

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
            console.log(`${chalk.red('invalid arg terminating...')}`);
            process.exit(0);
        }
    }

    console.log(`checking for existing ${chalk.blue('src/')} folder...`);

    qfs.list(baseDir)
        .then(files => {
            if(_.includes(files, 'src')) {
                console.log(`${chalk.blue('src/')} folder must not exist during setup. ${chalk.red('terminating...')}`);
                process.exit(0);
            }
            console.log(`creating ${chalk.blue('src/')} folder and sub directories`);
            return qfs.copyTree(baseDir+`/bin/_setup/${srcToCopy}`, srcDir);
        })
        .then(() => {
            console.log(`${chalk.blue('src/')} folder created ${chalk.green('successfully')}`);
            done();
        })
        .catch(err => {
            console.error(`${chalk.red('ERROR: setting up src/ folder', err)}`);
            done();
        });
});

gulp.task('lint', function() {
    handleMissingConfigFile();

    const
        config  = require('./webpack/config'),
        _v      = config.vars;

    return gulp.src(config.buildFiles)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                console.error('GULP PLUMBER > lint ERROR:', err);
            }
        }}))
        .pipe($.eslint({configFile: './test-riko/.eslintrc'}))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError());

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