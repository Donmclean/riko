const
    _v                          = require('./utils/variables')(),
    funcs                       = require('./utils/functions')(),
    customConfig                = require('./utils/coreRikoConfig'),
    webpackConfigUtils          = require('./utils/webpackConfigUtils')(_v, funcs, customConfig),
    config                      = {};

    //Static Webpack Plugins
    _v.HtmlWebpackPlugin        = require('html-webpack-plugin');
    _v.BrowserSyncPlugin        = require('browser-sync-webpack-plugin');
    _v.ExtractTextPlugin        = require("extract-text-webpack-plugin");
    _v.WebpackShellPlugin       = require('webpack-shell-plugin');
    _v.CleanWebpackPlugin       = require('clean-webpack-plugin');
    _v.WebpackNotifierPlugin    = require('webpack-notifier');
    _v.CopyWebpackPlugin        = require('copy-webpack-plugin');

    const staticWebpackPlugins  =_v._
        .chain(_v)
        .pickBy((value, key) => !_v._.isEmpty(key.match(/Plugin\b/)) || (key === 'webpack'))
        .value();


//CONFIGURATION
config.context = customConfig.baseDir;

//TODO: fix bug in upgrading eslint-loader
// process.traceDeprecation = true;

config.entry = customConfig.entry;

config.output = {
    filename: '[name].js?[hash]',
    path: customConfig.output.path,
    publicPath: '/'
};

config.resolve = {
    extensions: ['.js', '.jsx', '.json'],
    modules: [_v.path.resolve(customConfig.baseDir, "node_modules"), _v.path.resolve(_v.baseDir, "node_modules")]
};

config.resolveLoader = {
    modules: [_v.path.resolve(customConfig.baseDir, "node_modules"), _v.path.resolve(_v.baseDir, "node_modules")]
};

const checkForConfigFile = (configFile) => {
    return !_v._.isEmpty(configFile) && !!funcs.sanitizePath(customConfig.baseDir, configFile)
};

config.module = {};
config.module.rules = _v._.flatten([
    //JAVASCRIPT
    checkForConfigFile(customConfig.eslintLoaderOptions.configFile) ? webpackConfigUtils.getEslintRule() : [],
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
]);

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************
config.plugins = [];

//Set Global Plugins
config.plugins = funcs.handlePlugins(
    config.plugins,
    [
        customConfig.setPlugins('global', staticWebpackPlugins),

        //build defaults
        new _v.WebpackNotifierPlugin({contentImage: _v.baseDir+'/build-assets/riko-logo.png'})
    ]
);

switch (process.env.NODE_ENV) {
    case "production": {
        config.output.sourceMapFilename = '[file].map?[hash]';
        config.devtool = customConfig.sourcemapProd ? customConfig.sourcemapType : null;
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

        //Set Production Plugins
        config.plugins = funcs.handlePlugins(
            config.plugins,
            [
                customConfig.setPlugins('prod', staticWebpackPlugins),

                //build defaults
                new _v.WebpackShellPlugin({
                    onBuildStart: customConfig.onBuildStartShellCommands,
                    onBuildEnd: customConfig.onBuildEndShellCommands,
                    onBuildExit: customConfig.onBuildExitShellCommands
                }),
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
        config.devtool = customConfig.sourcemapDev ? customConfig.sourcemapType : null;
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

        //Set Development Plugins
        config.plugins = funcs.handlePlugins(
            config.plugins,
            [
                customConfig.setPlugins('dev', staticWebpackPlugins),

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
