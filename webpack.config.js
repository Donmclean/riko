const
    _v                          = require('./utils/variables')(),
    funcs                       = require('./utils/functions')(),
    customConfig                = require('./utils/coreRikoConfig'),
    webpackConfigUtils          = require('./utils/webpackConfigUtils')(_v, funcs, customConfig);

    //Static Webpack Plugins
    _v.HtmlWebpackPlugin        = require('html-webpack-plugin');
    _v.BrowserSyncPlugin        = require('browser-sync-webpack-plugin');
    _v.ExtractTextPlugin        = require("extract-text-webpack-plugin");
    _v.CleanWebpackPlugin       = require('clean-webpack-plugin');
    _v.WebpackNotifierPlugin    = require('webpack-notifier');
    _v.CopyWebpackPlugin        = require('copy-webpack-plugin');

    const staticWebpackPlugins  =_v._
        .chain(_v)
        .pickBy((value, key) => !_v._.isEmpty(key.match(/Plugin\b/)) || (key === 'webpack'))
        .value();


//CONFIGURATION
let config = {};

config.context = customConfig.baseDir;

config.entry = customConfig.entry;

config.output = {
    filename: '[name].js?[hash]',
    path: customConfig.output.path,
    publicPath: '/'
};

//Set Additional node_modules Resolver Paths
const yarnNodeModulePath = _v.path.resolve(_v.os.homedir() + '/.config/yarn/global/', 'node_modules');
const yarnNodeModulePathLinuxRoot = _v.path.resolve('/usr/local/share/.config/yarn/global', 'node_modules');
const yarnNodeModulePathWindows = _v.path.resolve('%LOCALAPPDATA%/Yarn/config/global', 'node_modules');

const moduleResolverPaths = [
    _v.path.resolve(customConfig.baseDir, "node_modules"),
    _v.path.resolve(_v.baseDir, "node_modules"),
    yarnNodeModulePath,
    yarnNodeModulePathLinuxRoot,
    yarnNodeModulePathWindows
];

config.resolve = {
    extensions: ['.js', '.jsx', '.json'],
    modules: moduleResolverPaths
};

config.resolveLoader = {
    modules: moduleResolverPaths
};

config.module = {};

const defaultLoaders = [
    //JAVASCRIPT
    {
        test: /\.jsx$|\.js$/,
        exclude: /(node_modules|vendor|bower_components)/,
        loaders: process.env.NODE_ENV === 'development' ? [
            'react-hot-loader/webpack',
            'babel-loader'
        ] : ['babel-loader']
    },
    //TYPESCRIPT TODO: add this functionality
    // {
    //     test: /\.tsx?$/,
    //     loaders: ['react-hot-loader/webpack', 'ts-loader'] // (or awesome-typescript-loader)
    // },
    //TEMPLATES (PUG)
    {
        test: /\.pug$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['pug-loader']
    },
    //TEMPLATES (HANDLEBARS)
    {
        test: /\.handlebars$|\.hbs$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['handlebars-loader']
    },
    //VIDEOS
    {
        test: /\.(mpeg|mpg|mp4|avi|wmv|flv)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.videoOutputPath}/[name].[ext]?[hash]`
    },
    //AUDIO
    {
        test: /\.(wav|mp3|aiff|flac|mp4a|m4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.audioOutputPath}/[name].[ext]?[hash]`
    },
    //FILES
    {
        test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.miscFileOutputPath}/[name].[ext]?[hash]`
    }
];

// Set Global Rules/Loaders
config.module.rules = Object.values(customConfig.setWebpackLoaders('global', defaultLoaders) || defaultLoaders);

config.plugins = [];

//Set Global Plugins
config.plugins = funcs.handleCustomAdditions(
    config.plugins,
    [
        customConfig.setWebpackPlugins('global', staticWebpackPlugins) || [],

        //build defaults
        new _v.WebpackNotifierPlugin({contentImage: _v.baseDir+'/build-assets/riko-logo.png'})
    ]
);

// Set Global Config Options
config = Object.assign({}, config, customConfig.setWebpackConfigOptions('global', Object.create(config)));

switch (process.env.NODE_ENV) {
    case "production": {
        config.output.sourceMapFilename = '[file].map?[hash]';
        config.devtool = customConfig.sourcemapProd ? customConfig.sourcemapType : false;
        config.bail = true;

        config.module.rules = config.module.rules.concat([
            //SASS
            funcs.stylesheetProdRules('sass', /\.scss$/, customConfig, _v.ExtractTextPlugin),
            //LESS
            funcs.stylesheetProdRules('less', /\.less$/, customConfig, _v.ExtractTextPlugin),
            //STYLUS
            funcs.stylesheetProdRules('stylus', /\.styl$/, customConfig, _v.ExtractTextPlugin),
            //CSS
            funcs.stylesheetProdRules('css', /\.css$/, customConfig, _v.ExtractTextPlugin),
            //FONTS
            {
                test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: `file-loader?name=${customConfig.fontOutputPath}/[name].[ext]?[hash]`
            },
            //IMAGES
            {
                test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loader: `file-loader?name=${customConfig.imageOutputPath}/[name].[ext]?[hash]`
            }
        ]);

        // Set Production Config Options
        config = Object.assign({}, config, customConfig.setWebpackConfigOptions('production', Object.create(config)));

        // Set Production Rules/Loaders
        config.module.rules = Object.values(customConfig.setWebpackLoaders('production', config.module.rules) || config.module.rules);

        //Set Production Plugins
        config.plugins = funcs.handleCustomAdditions(
            config.plugins,
            [
                customConfig.setWebpackPlugins('production', staticWebpackPlugins) || [],

                //build defaults
                new _v.CleanWebpackPlugin([_v.path.basename(config.output.path)], {root: customConfig.baseDir, verbose: true, dry: false}),
                new _v.webpack.LoaderOptionsPlugin({
                    debug: false
                })
            ]
        );

        break;
    }
    case "test":
    case "development": {
        config.devtool = customConfig.sourcemapDev ? customConfig.sourcemapType : false;
        config.bail = false;

        config.devServer = {
            hot: true,
            // enable HMR on the server

            contentBase: config.output.path,
            // match the output path

            publicPath: config.output.publicPath
            // match the output `publicPath`
        };

        config.module.rules = config.module.rules.concat([
            // SASS
            funcs.stylesheetDevRules('sass', /\.scss$/, customConfig),
            // LESS
            funcs.stylesheetDevRules('less', /\.less$/, customConfig),
            //STYLUS
            funcs.stylesheetDevRules('stylus', /\.styl$/, customConfig),
            // CSS
            funcs.stylesheetDevRules('css', /\.css$/, customConfig),
            //FONTS
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: "url-loader?mimetype=application/font-woff"
            },
            {
                test: /\.(eot|ttf|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader'
            },
            //IMAGES
            {
                test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loader: 'url-loader'
            }
        ]);

        // Set Production Config Options
        config = Object.assign({}, config, customConfig.setWebpackConfigOptions('development', Object.create(config)));

        if(JSON.parse(process.env.isWeb) && !JSON.parse(process.env.isElectron)) {
            //WEB DEV MODE
            config.plugins = config.plugins.concat([new _v.BrowserSyncPlugin(
                {
                    proxy: `http://localhost:${customConfig.EXPRESS_PORT}`
                },
                {
                    reload: !!customConfig.hotReloadingOptions.BrowserSyncReloadOnChange //Allows hot module reloading to take care of this. (preserves state)
                })
            ]);
        }

        // Set Development Rules/Loaders
        config.module.rules = Object.values(customConfig.setWebpackLoaders('development', config.module.rules) || config.module.rules);

        //Set Development Plugins
        config.plugins = funcs.handleCustomAdditions(
            config.plugins,
            [
                customConfig.setWebpackPlugins('development', staticWebpackPlugins) || [],

                //build defaults
                new _v.webpack.HotModuleReplacementPlugin(),
                new _v.webpack.NamedModulesPlugin(),
                new _v.webpack.LoaderOptionsPlugin({
                    debug: true
                })
            ]
        );

        break;
    }
    default: {
        break;
    }
}

//HANDLE ELECTRON SPECIFIC OPTIONS
if(JSON.parse(process.env.isElectron)) {
    config.plugins = funcs.handleElectronEnvironmentOptions(config, customConfig);
}

config.stats = funcs.getStats(process.env.NODE_ENV);

module.exports = config;
