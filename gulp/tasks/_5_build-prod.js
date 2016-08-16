module.exports = (gulp, $, config, funcs) => {

    funcs.exitOnGulpGlobalErrors = true;

    gulp.task('build-prod',
        gulp.series(
            (cb) => {
                funcs.isProd = true;
                cb();
            },
            gulp.parallel('lint-gulp','lint-js-src','lint-js-tests','clean','clean-temp'),
            gulp.series('media','sass','css-deps','js-src','js-deps'),
            'templates'
            // 'run-unit-tests',
            // 'run-selenium-tests'
        )
    );
};