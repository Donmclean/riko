"use strict";
module.exports = (gulp) => {
    
    gulp.task('media',
        gulp.parallel('audio', 'files', 'fonts', 'images','videos')
    );
};