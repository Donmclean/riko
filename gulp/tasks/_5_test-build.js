"use strict";
module.exports = (gulp) => {
    gulp.task('test-build', gulp.series(
        gulp.parallel('lint-gulp')
    ));
};