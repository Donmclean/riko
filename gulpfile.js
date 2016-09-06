const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    config = require('./webpack/config'),
    _v = config.vars;

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