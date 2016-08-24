const
    webpack = require('karma-webpack'),
    webpackConfig = require('./webpack.config'),
    path = require('path');

module.exports = function (config) {
    config.set({
        browsers: [ 'PhantomJS' ], //run in PhantomJS

        singleRun: true, //just run once by default
        frameworks: [ 'chai','mocha' ], //use the mocha test framework

        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            // 'src/**/*.jsx',
            'src/tests/**/*-spec.js'
        ],

        preprocessors: {
            'src/tests/**/*-spec.js': ['webpack','sourcemap','coverage'],
            'src/js/**/*.jsx': ['webpack','sourcemap','coverage'],
            // 'src/tests/**/*spec.js': ['webpack', 'sourcemap', 'babel', 'coverage']
            // 'src/tests/**/*spec.js': ['babel']
        },

        plugins: [
            //others
            webpack,'karma-sourcemap-loader', 'karma-spec-reporter',
            'karma-babel-preprocessor', 'karma-coverage','karma-mocha-reporter',

            //Browser Launchers
            'karma-chrome-launcher','karma-phantomjs-launcher','karma-safari-launcher',
            'karma-firefox-launcher',

            //testing frameworks
            'karma-jasmine','karma-chai', 'karma-mocha',
        ],

        reporters: [ 'mocha', 'coverage' ], //report results in this format

        coverageReporter: {
            type: 'html', //produces a html document after code is run
            dir: 'test-coverage/' //path to created html doc
        },

        webpack: {
            entry: [
                './src/js/app.js'
            ],
            output: {
                path: __dirname,
                filename: 'app.js',
                publicPath: ''
            },
            resolve: {
                extensions: ['', '.js', '.jsx'],
                root: path.resolve(path.join(__dirname, 'src')),
            },
            devtool: 'eval-source-map',
            module: {
                loaders: [
                    {
                        test: /\.jsx$|\.js$/,
                        loaders: ['babel'],
                        include: path.join(__dirname, 'src')
                    }
                ]
            }
        },

        logLevel: config.LOG_INFO,

        captureConsole: true,
        colors: true,

        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true //please don't spam the console when running in karma!
        }
    });
};