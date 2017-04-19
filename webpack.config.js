const
    _v                          = require('./utils/variables')(),
    funcs                       = require('./utils/functions')(),
    customConfig                = require('./utils/coreRikoConfig'),
    webpackConfigUtils          = require('./utils/webpackConfigUtils')(_v, funcs, customConfig),
    config                      = {};

//CONFIGURATION
config.context = customConfig.baseDir;

//TODO: fix bug in upgrading eslint-loader
// process.traceDeprecation = true;

config.entry = {};
config.entry['index'] = [customConfig.entryFile];

config.output = {
    filename: '[name].js?[hash]',
    path: customConfig.destDir,
    publicPath: '/'
};

config.resolve = {
    extensions: ['.js', '.jsx', '.json'],
    alias: config.externalModulePaths,
    modules: [_v.path.resolve(_v.baseDir, "node_modules"), "node_modules"]
};

config.resolveLoader = {
    modules: [_v.path.resolve(_v.baseDir, "node_modules"), "node_modules"]
};

config.module = {};
config.module.rules = _v._.flatten([
    //JAVASCRIPT
    customConfig.eslintConfig ? webpackConfigUtils.getEslintRule() : [],
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

if(!_v._.isEmpty(customConfig.templateFile)) {
    config.plugins = config.plugins.concat(
        [new _v.HtmlWebpackPlugin(webpackConfigUtils.getHtmlWebpackPluginOptions())],
        [customConfig.stylelintConfig ? new _v.StyleLintPlugin(webpackConfigUtils.getStyleLintPluginOptions()) : []]
    );
}

if(customConfig.enableWebpackVisualizer) {
    config.plugins = config.plugins.concat([
        new _v.Visualizer({
            filename: funcs.insertGitSHAIntoFilename(_v.GIT_VERSION)
        })
    ]);
}

config.plugins = config.plugins.concat([
    new _v.webpack.EnvironmentPlugin([
        "NODE_ENV"
    ]),
    new _v.webpack.DefinePlugin(webpackConfigUtils.getDefinePluginOptions()),
    new _v.ProgressBarPlugin({
        format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
    new _v.WebpackNotifierPlugin({contentImage: _v.baseDir+'/build-assets/riko-logo.png'})
]);

switch (process.env.NODE_ENV) {
    case "production": {
        config.output.sourceMapFilename = '[file].map?[hash]';
        config.devtool = customConfig.sourcemapProd ? customConfig.sourcemapType : null;
        config.bail = true;

        const stylesheetProdRules = (type, regex) => ({
            test: new RegExp(regex),
            use: _v.ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: customConfig.sourcemapProd
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => {
                                return [
                                    _v.autoprefixer({ browsers: ['> 0%'] })
                                ];
                            }
                        }
                    },
                    {
                        loader: `${type}-loader`,
                        options: {
                            sourceMap: customConfig.sourcemapProd
                        }
                    }
                ]
            })
        });

        config.module.rules = config.module.rules.concat([
            //SASS
            stylesheetProdRules('sass', /\.scss$/),
            //LESS
            stylesheetProdRules('less', /\.less$/),
            //STYLUS
            stylesheetProdRules('stylus', /\.styl$/),
            //CSS
            {
                test: /\.css$/,
                use: _v.ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: customConfig.sourcemapProd
                            }
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => {
                                    return [
                                        _v.autoprefixer({ browsers: ['> 0%'] })
                                    ];
                                }
                            }
                        }
                    ]
                })
            },
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

        config.plugins = config.plugins.concat([
            new _v.webpack.optimize.UglifyJsPlugin(webpackConfigUtils.getUglifyJsPluginOptions()),
            new _v.webpack.optimize.CommonsChunkPlugin({name: 'index', filename: customConfig.jsOutputPath + '/' + config.output.filename}),
            new _v.webpack.ProvidePlugin(customConfig.externalModules),
            new _v.ExtractTextPlugin({filename: customConfig.cssOutputPath + '/' + customConfig.cssOutputFilename + '?[hash]', allChunks: true}),

            //Image optimization options | imagemin-webpack-plugin
            //https://github.com/Klathmon/imagemin-webpack-plugin
            new _v.ImageminPlugin(customConfig.imageminConfig),
            new _v.WebpackShellPlugin({
                onBuildStart: customConfig.onBuildStartShellCommands,
                onBuildEnd: customConfig.onBuildEndShellCommands,
                onBuildExit: customConfig.onBuildExitShellCommands
            }),
            new _v.CleanWebpackPlugin([_v.path.basename(customConfig.destDir)], {root: customConfig.baseDir, verbose: true, dry: false}),
            new _v.webpack.LoaderOptionsPlugin({
                debug: false
            })
        ]);

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

        const stylesheetDevRules = (type, regex) => ({
            test: new RegExp(regex),
            loaders: [
                'style-loader',
                `css-loader${customConfig.sourcemapDev ? '?sourceMap' : ''}`,
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => {
                            return [
                                _v.autoprefixer({ browsers: ['> 0%'] })
                            ];
                        }
                    }
                },
                `${type}-loader${customConfig.sourcemapDev ? '?sourceMap' : ''}`
            ]
        });

        config.module.rules = config.module.rules.concat([
            // SASS
            stylesheetDevRules('sass', /\.scss$/),
            // LESS
            stylesheetDevRules('less', /\.less$/),
            //STYLUS
            stylesheetDevRules('stylus', /\.styl$/),
            // CSS
            {
                test: /\.css$/,
                include: customConfig.srcDir,
                loaders: [
                    'style-loader',
                    `css-loader${customConfig.sourcemapDev ? '?sourceMap' : ''}`,
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => {
                                return [
                                    _v.autoprefixer({ browsers: ['> 0%'] })
                                ];
                            }
                        }
                    }
                ]
            },
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

        config.plugins = config.plugins.concat([
            new _v.webpack.HotModuleReplacementPlugin(),
            new _v.webpack.NamedModulesPlugin(),
            new _v.webpack.ProvidePlugin(customConfig.externalModules),
            new _v.webpack.LoaderOptionsPlugin({
                debug: true
            })
        ]);

        if(!_v._.isEmpty(customConfig.templateFile) && !JSON.parse(process.env.ELECTRON)) {
            //WEB DEV MODE
            config.plugins = config.plugins.concat([new _v.BrowserSyncPlugin(
                {
                    proxy: 'http://localhost:' + customConfig.EXPRESS_PORT
                },
                {
                    reload: customConfig.BrowserSyncReloadOnChange //Allows hot module reloading to take care of this. (preserves state)
                })
            ]);
        }

        //handle remote debugging
        if(customConfig.enableRemoteDebugging && process.env.NODE_ENV === "development") {
            funcs.launchVorlonJS();
            customConfig.externalScripts.push({src: `http://${_v.ipAddress}:1337/vorlon.js`});
        }

        break;
    }
    default: {
        break;
    }
}

//HANDLE ELECTRON SPECIFIC OPTIONS
if(JSON.parse(process.env.ELECTRON)) {
    config.plugins = funcs.handleElectronEnvironmentOptions(config, customConfig);
}

config.stats = funcs.getStats(process.env.NODE_ENV);

module.exports = config;
