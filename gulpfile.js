const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    config = require('./webpack/config');

gulp.task('pug', function() {

    return gulp.src(['src/templates/**/*.pug'])
        .pipe($.pug())
        .pipe($.injectString.before('</body>',`<script src="bundle.js" type="text/javascript"></script>`))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch-pug', function () {
   return gulp.watch(['src/templates/**/*.pug'], gulp.parallel('pug'));
});