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

const lint = (isLintBuild) => {

    const
        config  = require('./webpack/config');

    return gulp.src(isLintBuild ? config.buildFiles : config.srcFiles)
        .pipe($.plumber({errorHandler: (err) => {
            if(err) {
                $.util.log('GULP PLUMBER > lint ERROR:', err);
            }
        }}))
        .pipe($.eslint({configFile: isLintBuild ? './test-riko/.eslintrc' : './src/__linters/.eslintrc'}))
        .pipe($.eslint.format())
        .pipe($.eslint.failAfterError())
        .pipe($.debug({title: 'linting js files:'}));
};

gulp.task('lint-build', function() {
    handleMissingConfigFile();
    return lint(true);

});

gulp.task('lint-src', function() {
    handleMissingConfigFile();
    return lint(false);
});
