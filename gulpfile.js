"use strict";
const
    gulp    = require('gulp'),
    $       = require('gulp-load-plugins')(),
    qfs     = require('q-io/fs'),
    _       = require('lodash'),
    path    = require('path'),
    spawn   = require('child_process').spawn,
    baseDir = path.resolve(__dirname),
    srcDir  = baseDir+'/src',
    args    = process.argv;

const handleMissingConfigFile = () => {
    try {
        require('./webpack/config');
    } catch (err) {
        $.util.log($.util.colors.red('ERROR:') + $.util.colors.yellow(' must have a valid custom-config.js file in ' +
            $.util.colors.red('src/') + ' folder. ') +
            $.util.colors.cyan('Try running '+ $.util.colors.blue('"npm run setup"')+' to get started.'));
        throw new Error('must have a valid custom-config.js');
    }
};

const hasSrcFolder = (files) => {
    return _.includes(files, 'src');
};

const isReactNative = (srcToCopy) => {
    return srcToCopy === 'react-native';
};

gulp.task('setup', function (done) {

    let srcToCopy;

    switch (args[3]) {
        case '--js': {
            srcToCopy = 'src-js';
            break;
        }
        case '--web': {
            srcToCopy = 'src-web';
            break;
        }
        case '--mobile': {
            srcToCopy = 'react-native';
            break;
        }
        case '--electron': {
            srcToCopy = 'electron';
            break;
        }
        default: {
            $.util.log(`${$.util.colors.red('invalid arg terminating...')}`);
            throw new Error('invalid arg terminating...');
        }
    }

    $.util.log($.util.colors.yellow(`checking for existing ${$.util.colors.blue('src/')} folder...`));

    qfs.list(baseDir)
        .then(files => {
            if(hasSrcFolder(files)) {
                $.util.log($.util.colors.yellow(`${$.util.colors.blue('src/')} folder must not exist during setup. ${$.util.colors.red('terminating...')}`));
                throw new Error('src/ folder must not exist during setup.');
            } else if(isReactNative(srcToCopy)) {
                //run react native shell script
                const cmd = spawn('sh', ['./bin/_setup/src-mobile/react-native.sh'], {stdio: 'inherit'});
                cmd.on('close', () => done());
            } else {
                $.util.log($.util.colors.yellow(`creating ${$.util.colors.blue('src/')} folder and sub directories`));
                qfs.copyTree(baseDir+`/bin/_setup/${srcToCopy}`, srcDir).then(() => {
                    $.util.log($.util.colors.yellow(`${$.util.colors.blue('src/')} folder created ${$.util.colors.green('successfully')}`));
                    done();
                });
            }
        })
        .catch(err => {
            $.util.log(`${$.util.colors.red('ERROR: setting up src/ folder', err)}`);
            done();
        });
});

const lint = (isLintBuild) => {

    const config  = require('./webpack/config');

    return gulp.src(isLintBuild ? config.buildFiles : config.srcFiles)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                $.util.log('GULP PLUMBER > lint ERROR:', err);
            }
        }}))
        .pipe($.eslint({configFile: isLintBuild ? './test-riko/.eslintrc.js' : './src/__linters/.eslintrc.js'}))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.debug({title: 'linting js files:'}));
};

gulp.task('lint-build', () => {
    handleMissingConfigFile();
    return lint(true);

});

gulp.task('lint-src', () => {
    handleMissingConfigFile();
    return lint(false);
});

gulp.task('test-jest', (cb) => {

    const cmd = spawn('jest', {stdio: 'inherit'});

    cmd.on('close', (code) => {
        if(code > 0) {
            $.util.log(`${$.util.colors.red('ERROR: JEST TEST FAILED!')}`);
        } else {
            $.util.log(`${$.util.colors.green('JEST TEST PASSED!')}`);
        }
        cb();
    });

});
