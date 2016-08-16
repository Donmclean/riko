const custom_config     = require('./webpack/config');

const
    config      = custom_config || {},
    indexJSFile = require('./webpack/index')(config);
    _v          = config.vars = require('./webpack/variables')();


config.context  = config.baseDir;
config.devtool  = _v.NODE_ENV === "development" ? "inline-sourcemap" : null;
config.entry    = config.js_main_entry;

config.output = {
    path: config.destDir,
    publicPath: "",
    filename: config.js_main_name
};

config.module = {
    preLoaders: [
        {
            test: /\.jsx?$/,
            loaders: [ "babel-loader", "eslint-loader" ],
            exclude: /(node_modules|bower_components)/
        }
    ],
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel', // 'babel-loader' is also a legal name to reference
            query: {
                presets: ['react', 'es2015', 'stage-0'],
                plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy','add-module-exports']
            }
        },
        {
            test: /\.pug$/,
            exclude: /(node_modules|bower_components)/,
            loader: "pug-loader"
        },
    ]
};

config.eslint = {
    failOnError: _v.NODE_ENV === "production"
};

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************

let plugins = [
    new _v.ProgressBarPlugin({
        format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
    new _v.HtmlWebpackPlugin(indexJSFile)
];

if(_v.NODE_ENV === "production") {
    plugins = plugins.concat([
        new _v.webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new _v.webpack.optimize.DedupePlugin(),
        new _v.webpack.optimize.OccurenceOrderPlugin(),
        new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false, compress: {warnings: false} })
    ]);
}

config.plugins = plugins;

module.exports = config;
