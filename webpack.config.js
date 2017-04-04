const
    _v              = require('./config/variables')(),
    funcs           = require('./config/functions')(),
    customConfig    = funcs.getFileIfExists(`${_v.cwd}/src/rikoconfig`),
    config          = {},
    indexJSFile     = require('./config/index')(customConfig);

//CONFIGURATION
config.context = customConfig.srcDir;

//TODO: fix bug in upgrading eslint-loader
// process.traceDeprecation = true;

config.entry = {};
config.entry[customConfig.moduleName] = [customConfig.js_main_entry_path];

config.output = {
    filename: '[name].js?[hash]',
    path: customConfig.destDir,
    publicPath: '/'
};

config.resolve = {
    extensions: ['.js', '.jsx', '.json'],
    alias: config.externalModulePaths
};

config.module = {};
config.module.rules = [
    //JAVASCRIPT
    {
        test: /\.jsx$|\.js$/,
        include: customConfig.srcDir,
        exclude: /(node_modules|vendor|bower_components)/,
        enforce: 'pre',
        use: [{
            loader: 'eslint-loader',
            options: {
                configFile: customConfig.srcDir+'/__linters/.eslintrc.js'
            }
        }]
    },
    {
        test: /\.jsx$|\.js$/,
        exclude: /(node_modules|vendor|bower_components)/,
        use: process.env.NODE_ENV === 'development' ? [
            {
                loader: 'react-hot-loader/webpack'
            },
            {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {"modules": false}],
                        'react'
                    ],
                    plugins: [
                        "react-hot-loader/babel"
                    ],
                    babelrc: false,
                }
            },
        ] : [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['es2015', {"modules": false}],
                        'react'
                    ],
                    babelrc: false
                }
            }]
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
    //TEMPLATES (OTHER)
    {
        test: /\.(ejs|mustache|hbs|handlebars)$/,
        loader: "template-html-loader"+ !_v._.isEmpty(customConfig.template_engine) ? '?engine='+customConfig.template_engine : ''
    },
    //IMAGES
    {
        test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loaders: [`file-loader?name=[name].[ext]?[hash]`]
    },
    //VIDEOS
    {
        test: /\.(mpeg|mpg|mp4|avi|wmv|flv)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.media_video_output_path}/[name].[ext]?[hash]`
    },
    //AUDIO
    {
        test: /\.(wav|mp3|aiff|flac|mp4a|m4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.media_audio_output_path}/[name].[ext]?[hash]`
    },
    //FILES
    {
        test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: `file-loader?name=${customConfig.media_files_output_path}/[name].[ext]?[hash]`
    }
];

//*****************************************************************
//*****************************PLUGINS*****************************
//*****************************************************************
config.plugins = [];

//handles mapping of runtime configs defined in customConfig.js
const runtimeConfigs = _v._
    .chain(customConfig.js_runtime_configs)
    .keyBy((item) => item.key)
    .mapValues((item) => item.value)
    .value();

if(customConfig.requiresTemplate) {
    config.plugins = config.plugins.concat([
        new _v.HtmlWebpackPlugin(indexJSFile),
        new _v.StyleLintPlugin({
            configFile: customConfig.stylelintConfig,
            files: [
                '**/*.s?(a|c)ss',
                '**/*.styl',
                '**/*.less',
                '**/*.css',
                '!(vendor)**/*.css'
            ],
            failOnError: customConfig.failOnProdBuildStyleError
        })
    ]);
}

if(customConfig.enableWebpackVisualizer) {
    config.plugins = config.plugins.concat([
        new _v.Visualizer({
            filename: funcs.insertGitSHAIntoFilename(customConfig.template_stats_file_name, _v.GIT_VERSION)
        })
    ]);
}

config.plugins = config.plugins.concat([
    new _v.webpack.EnvironmentPlugin([
        "NODE_ENV"
    ]),
    new _v.webpack.DefinePlugin(runtimeConfigs),
    new _v.ProgressBarPlugin({
        format: 'webpack [:bar] ' + _v.chalk.green.bold(':percent') + ' (:elapsed seconds)',
        clear: true
    }),
    new _v.WebpackNotifierPlugin({contentImage: customConfig.baseDir+'/test-riko/riko-favicon.png'})
]);

switch (process.env.NODE_ENV) {
    case "production": {
        config.output.sourceMapFilename = '[file].map?[hash]';
        config.devtool = customConfig.sourcemapProd ? customConfig.sourcemapType : null;
        config.bail = customConfig.failOnProdBuildJsError;

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
                loader: `file-loader?name=${customConfig.media_fonts_output_path}/[name].[ext]?[hash]`
            },
            //IMAGES
            {
                test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loader: `file-loader?name=${customConfig.media_images_output_path}/[name].[ext]?[hash]`
            }
        ]);

        config.plugins = config.plugins.concat([
            new _v.webpack.optimize.UglifyJsPlugin({mangle: false, sourceMap: customConfig.sourcemapProd }),
            new _v.webpack.optimize.CommonsChunkPlugin({name: customConfig.moduleName, filename: customConfig.js_output_path + '/' + customConfig.js_main_file_name + '?[hash]'}),
            new _v.webpack.ProvidePlugin(customConfig.externalModules),
            new _v.ExtractTextPlugin({filename: customConfig.styles_main_file_name + '?[hash]', allChunks: true}),

            //Image optimization options | imagemin-webpack-plugin
            //https://github.com/Klathmon/imagemin-webpack-plugin
            new _v.ImageminPlugin(customConfig.imageminConfig),
            new _v.WebpackShellPlugin({
                onBuildStart: customConfig.onBuildStartShellCommands,
                onBuildEnd: customConfig.onBuildEndShellCommands,
                onBuildExit: customConfig.onBuildExitShellCommands
            }),
            new _v.CleanWebpackPlugin([customConfig.destDir], {root: customConfig.baseDir, verbose: true, dry: false}),
            new _v.webpack.LoaderOptionsPlugin({
                debug: false,
                eslint: {
                    failOnError: customConfig.failOnProdBuildJsError,
                    failOnWarning: false,
                    quiet: customConfig.eslintQuietMode,
                    configFile: customConfig.eslintConfig
                }
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
                debug: true,
                eslint: {
                    failOnError: false,
                    failOnWarning: false,
                    emitError: true,
                    quiet: customConfig.eslintQuietMode,
                    configFile: customConfig.eslintConfig
                }
            })
        ]);

        if(customConfig.requiresTemplate && !JSON.parse(process.env.ELECTRON)) {
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
            customConfig.js_external_scripts.push({src: `http://${_v.ipAddress}:1337/vorlon.js`});
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
