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

config.module = {};

const defaultLoaders = {
    //JAVASCRIPT
    eslintDefault: {
        test: /\.jsx$|\.js$/,
        include: customConfig.srcDir,
        exclude: /(node_modules|vendor|bower_components)/,
        enforce: 'pre',
        use: [{
            loader: 'eslint-loader',
            options: {
                configFile: '.eslintrc.js',
                failOnError: process.env.NODE_ENV === 'production',
                failOnWarning: false,
                emitError: process.env.NODE_ENV === 'development',
                quiet: false //set true to disable warnings based on your eslint config
            }
        }]
    },
    jsDefault: {
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
    pugDefault: {
        test: /\.pug$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['pug-loader']
    },
    //TEMPLATES (HANDLEBARS)
    handlebarsDefault: {
        test: /\.handlebars$|\.hbs$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['handlebars-loader']
    },
    //VIDEOS
    videoDefault: {
        test: /\.(mpeg|mpg|mp4|avi|wmv|flv)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.videoOutputPath}/[name].[ext]?[hash]`
    },
    //AUDIO
    audioDefault: {
        test: /\.(wav|mp3|aiff|flac|mp4a|m4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.audioOutputPath}/[name].[ext]?[hash]`
    },
    //FILES
    miscFilesDefault: {
        test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.miscFileOutputPath}/[name].[ext]?[hash]`
    }
};

// Set Global Rules/Loaders
config.module.rules = Object.values(customConfig.setLoaders('global', defaultLoaders));

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************
config.plugins = [];

//Set Global Plugins
config.plugins = funcs.handleCustomAdditions(
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

        // Set Production Rules/Loaders
        config.module.rules = Object.values(customConfig.setLoaders('production', config.module.rules));

        //Set Production Plugins
        config.plugins = funcs.handleCustomAdditions(
            config.plugins,
            [
                customConfig.setPlugins('production', staticWebpackPlugins),

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

        // Set Development Rules/Loaders
        config.module.rules = Object.values(customConfig.setLoaders('development', config.module.rules));

        //Set Development Plugins
        config.plugins = funcs.handleCustomAdditions(
            config.plugins,
            [
                customConfig.setPlugins('development', staticWebpackPlugins),

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
