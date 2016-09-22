const
    webpackConfig = require('./webpack.config'),
    _v = webpackConfig.vars;

module.exports = (config) => {

    config.set({
        browsers: [ 'PhantomJS' ], //run in PhantomJS

        singleRun: true, //just run once by default
        frameworks: [ 'chai','mocha' ], //use the mocha test framework

        files: [
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            webpackConfig.baseDir+'/src/tests/**/*.spec.{js,jsx}',

        ],

        exclude: ['node_modules'],

        preprocessors: {
            'src/tests/**/*.spec.{js,jsx}': ['webpack'],
            'src/js/**/*.{js,jsx}': ['webpack','coverage']
        },

        plugins: [
            //others
            'karma-webpack','karma-sourcemap-loader', 'karma-spec-reporter',
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
            resolve: webpackConfig.resolve,
            module: {
                loaders: webpackConfig.module.loaders,
                postLoaders: [
                    { //delays coverage til after tests are run, fixing transpiled source coverage error
                        test: /\.jsx$|\.js$/,
                        // include: _v.path.resolve('src/js/'),
                        exclude: /(__tests__|tests|node_modules|bower_components)\//,
                        loader: 'istanbul-instrumenter'
                    }
                ]
            }
        },

        webpackMiddleware: {
            stats: 'errors-only'
        },

        logLevel: config.LOG_INFO,

        captureConsole: true,
        colors: true
    });
};