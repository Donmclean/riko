const
    gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    config = require('./webpack/config');

gulp.task('sass', function() {

    return gulp.src(['src/sass/styles.scss'])
        .pipe($.sass())
        .pipe($.addSrc.append(['src/css/**/*.css']))
        .pipe($.concat('styles.min.css'))
        .pipe($.cleanCss())
        .pipe(gulp.dest('./app'));
});

gulp.task('pug', function() {

    return gulp.src(['src/templates/**/*.pug'])
        .pipe($.pug())
        .pipe($.injectString.before('</body>',`<script src="bundle.js" type="text/javascript"></script>`))
        .pipe(gulp.dest('./app'));
});

gulp.task('watch-pug', function () {
   return gulp.watch(['src/templates/**/*.pug'], gulp.parallel('pug'));
});