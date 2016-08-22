const
    custom_config = require('./webpack/config'),
    config      = custom_config || {},
    indexJSFile = require('./webpack/index')(config);
    _v          = config.vars;

config.debug = true;
config.devtool = '#eval-source-map';
config.context = _v.path.join(__dirname, 'src', 'js');

config.entry = [
    'webpack/hot/dev-server',
    'webpack-hot-middleware/client',
    './riko'
];

config.output = {
    path: _v.path.join(__dirname, 'src', 'js'),
    publicPath: '/js/',
    filename: 'bundle.js'
};

config.module = {
    loaders: [
        {
            test: /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loaders: ['react-hot', 'babel']
        },
        {
            test: /\.scss$/,
            loaders: ["react-hot", "style", "css?sourceMap", "postcss", "sass?sourceMap"]
        },
        {
            test: /\.css$/,
            loaders: ["style", "css?sourceMap", "postcss"],
        },
        {
            test: /\.(jpg|jpeg|png|gif|tif|svg|woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: 'url'
        }
    ]
};

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************

let plugins = [
    new _v.webpack.EnvironmentPlugin([
        "NODE_ENV"
    ]),
    new _v.ProgressBarPlugin({
        format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
];

switch (_v.NODE_ENV) {
    case "production": {
        // config.devtool  = null;

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
        break;
    }
    case "development": {
        // config.devtool  = "inline-sourcemap";

        plugins = plugins.concat([
            new _v.webpack.optimize.OccurenceOrderPlugin(),
            new _v.webpack.HotModuleReplacementPlugin(),
            new _v.webpack.NoErrorsPlugin(),
            // new _v.BrowserSyncPlugin({
            //     host: 'localhost',
            //     port: 3000,
            //     server: { baseDir: ['app'] }
            // })
        ]);
        break;
    }
    default: {
        break;
    }
}

config.plugins = plugins;

module.exports = config;


// config.context  = config.baseDir;
//
// config.devtool  = null; //default to null handler in NODE_ENV switch case below
//
// config.entry    = config.js_main_entry;
//
// config.output   = {
//     path: config.destDir,
//     publicPath: "",
//     filename: config.js_main_name
// };
//
// config.resolve = {
//     extensions: ["", ".js", ".jsx"]
// };
//
// config.module   = {
//     preLoaders: [
//         {
//             test: /\.jsx?$/,
//             loaders: [ 'babel', 'eslint' ],
//             exclude: /(node_modules|bower_components)/
//         }
//     ],
//     loaders: [
//         {
//             test: /\.jsx?$/,
//             include : config.destDir,
//             exclude: /(node_modules|bower_components)/,
//             loader: ['babel'], // 'babel-loader' is also a legal name to reference
//             query: {
//                 presets: ['react', 'es2015', 'stage-0'],
//                 plugins: ['react-html-attrs', 'transform-class-properties', 'transform-decorators-legacy','add-module-exports']
//             }
//         },
//         {
//             test: /\.js$/,
//             exclude: /(node_modules|bower_components)\//,
//             loader: 'babel',
//             query: {
//                 presets: ['es2015']
//             }
//         },
//         {
//             test: /\.pug$/,
//             exclude: /(node_modules|bower_components)/,
//             loader: "pug-loader"
//         },
//         {
//             test: /\.scss$/,
//             loaders: ["style", "css?sourceMap", "postcss", "sass?sourceMap"]
//         },
//         {
//             test: /\.css$/,
//             loaders: ["style", "css?sourceMap", "postcss"],
//             // include: config.css_main
//         },
//         {
//             test: /\.(png|woff|woff2|eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
//             loader: 'url'
//         }
//     ],
//     postLoaders: [ { //delays coverage til after tests are run, fixing transpiled source coverage error
//         test: /\.js$/,
//         exclude: /(tests|node_modules|bower_components)\//,
//         loader: 'istanbul-instrumenter' } ]
// };
//
// config.postcss = [  _v.postcssImport, _v.autoprefixer() ];
//
//
// config.eslint = {
//     failOnError: _v.NODE_ENV === "production"
// };
//
// *****************************************************************
// *****************************PLUGINS*****************************
// *****************************************************************
//
//
// let plugins = [
//     new _v.webpack.EnvironmentPlugin([
//         "NODE_ENV"
//     ]),
//     new _v.ProgressBarPlugin({
//         format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
//         clear: true
//     }),
//     new _v.HtmlWebpackPlugin(indexJSFile),
//     new _v.StyleLintPlugin({
//         configFile: '.stylelintrc.yaml',
//         // context: 'inherits from webpack',
//         files: ['**/*.s?(a|c)ss','!node_modules/'],
//         // syntax: 'scss',
//         failOnError: false,
//     })
// ];
//
// switch (_v.NODE_ENV) {
//     case "production": {
//         config.devtool  = null;
//
//         plugins = plugins.concat([
//             new _v.webpack.DefinePlugin({
//                 'process.env': {
//                     'NODE_ENV': JSON.stringify('production')
//                 }
//             }),
//             new _v.webpack.optimize.DedupePlugin(),
//             new _v.webpack.optimize.OccurenceOrderPlugin(),
//             new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourcemap: false, compress: {warnings: false} })
//         ]);
//         break;
//     }
//     case "development": {
//         config.devtool  = "inline-sourcemap";
//
//         plugins = plugins.concat([
//             new _v.BrowserSyncPlugin({
//                 host: 'localhost',
//                 port: 3000,
//                 server: { baseDir: ['app'] }
//             })
//         ]);
//         break;
//     }
//     default: {
//         break;
//     }
// }
//
// config.plugins = plugins;

// module.exports = config;
