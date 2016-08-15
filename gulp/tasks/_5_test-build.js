"use strict";
module.exports = (gulp) => {
    gulp.task('test-build', gulp.series('build-prod'));
};