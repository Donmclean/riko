"use strict";
module.exports = (gulp, $, config) => {
    gulp.task('bump', (done) => {

        let options = {
            type: ['major','minor','patch','prerelease'],
            version: ''
        };

        if(config.vars.args.v){
            if(config.vars.args.v === '' || config.vars.args.v === true){
                config.vars.logi.error(`NEED CORRECT -v ARGUMENTS! -> 1.x.x  `);
                done();
            } else {
                gulp.src(config.packageJsonFile)
                    .pipe($.plumber())
                    .pipe($.bump({version: config.vars.args.v}))
                    .pipe(gulp.dest(config.baseDir));
            }

        } else if (config.vars.args.b){

            let str = config.vars.args.b;
            if(config.vars._.includes(options.type, str)) {
                $.util.log(str);
                gulp.src(config.packageJsonFile)
                    .pipe($.plumber())
                    .pipe($.bump({type: str}))
                    .pipe(gulp.dest(config.baseDir));
            } else {
                config.vars.logi.error(`NEED CORRECT -b ARGUMENTS! -> ('major','minor','patch','prerelease') `);
                done();
            }
        } else {
            config.vars.logi.error("NEED -v or -b ARGUMENTS! | -v -> 1.x.x | -b -> ('major','minor','patch','prerelease')");
            done();
        }
    });
};