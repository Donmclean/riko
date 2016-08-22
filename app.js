/**
 * Require Browsersync along with webpack and middleware for it
 */
var browserSync = require('browser-sync');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
var webpackConfig = require('./webpack.config');
var bundler = webpack(webpackConfig);

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
browserSync({
    reloadOnRestart: true,
    server: {
        baseDir: 'src',

        middleware: [
            webpackDevMiddleware(bundler, {
                // IMPORTANT: dev middleware can't access config, so we should
                // provide publicPath by ourselves
                publicPath: webpackConfig.output.publicPath,

                // pretty colored output
                stats: { colors: true }

                // for other settings see
                // http://webpack.github.io/docs/webpack-dev-middleware.html
            }),

            // bundler should be the same as above
            webpackHotMiddleware(bundler)
        ]
    },

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
    files: [
        'src/sass/**/*.scss',
        'src/css/**/*.css',
        'src/*.html'
        // {
        //     match: ['app/css/*.css','app/*.html','app/'],
        //     fn:    function (event, file) {
        //         browserSync.reload("*.html");
        //         console.log(":::::::::::::::::::");
        //     }
        // }
    ]
});

// const reloadBrowerSync = () => {
//     "use strict";
//     browserSync.reload("*.html");
// };
//
// browserSync.watch('src/**/*.html').on("change", reloadBrowerSync);

