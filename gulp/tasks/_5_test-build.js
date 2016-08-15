"use strict";
module.exports = (gulp) => {
    gulp.task('test-build', gulp.series('lint-gulp','build-prod'));
};