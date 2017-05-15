module.exports = (_v, funcs, customConfig) => {
    const webpackConfigUtils = {};
    //Static Webpack Plugins
    _v.BrowserSyncPlugin        = require('browser-sync-webpack-plugin');
    _v.ExtractTextPlugin        = require("extract-text-webpack-plugin");
    _v.CleanWebpackPlugin       = require('clean-webpack-plugin');
    _v.WebpackNotifierPlugin    = require('webpack-notifier');

    webpackConfigUtils.getElectronPackagerOptions = () => Object.assign(
        {},

        //Default
        {
            platform: 'all',
            icon: _v.path.resolve(__dirname, '../build-assets/riko-logo.incs')
        },

        //Custom
        customConfig.electronPackagerOptions,

        //Required
        {
            dir: customConfig.tempDir,
            overwrite: true,
            out: customConfig.output.path
        }
    );

    webpackConfigUtils.getDefaultConfigOptions = (env, configMap) => {
        switch (env) {
            case 'global': {
                const globalConfigOptions = {
                    loaders: [
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
                    ],

                    plugins: [
                        new _v.WebpackNotifierPlugin({contentImage: _v.baseDir+'/build-assets/riko-logo.png'})
                    ]
                };

                if(JSON.parse(process.env.isElectron)) {
                    //GLOBAL OPTIONS
                    configMap.setIn(['output', 'path'], customConfig.tempDir);
                    configMap.setIn(['output', 'publicPath'], '');
                }

                return globalConfigOptions;
            }
            case 'production': {
                const productionConfigOptions = {
                    loaders: [
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
                    ],
                    plugins: [
                        new _v.ExtractTextPlugin({
                            filename: 'assets/css/styles.min.css?[hash]',
                            allChunks: true
                        }),
                        new _v.CleanWebpackPlugin([_v.path.basename(configMap.getIn(['output', 'path']))], {root: customConfig.baseDir, verbose: true, dry: false}),
                        new _v.webpack.LoaderOptionsPlugin({
                            debug: false
                        })
                    ]
                };

                const CopyWebpackPlugin = require('copy-webpack-plugin');

                const electronPackagerOptions = webpackConfigUtils.getElectronPackagerOptions();

                if(JSON.parse(process.env.isElectron)) {
                    productionConfigOptions.plugins = productionConfigOptions.plugins.concat([
                        [
                            [
                                new CopyWebpackPlugin([
                                    { from: customConfig.srcDir + '/electron.js', to: customConfig.tempDir },
                                    { from: customConfig.srcDir + '/package.json', to: customConfig.tempDir },
                                    { from: electronPackagerOptions.icon, to: customConfig.tempDir }
                                ])
                            ]
                        ]
                    ]);
                }

                return productionConfigOptions;
            }
            case 'development': {
                const developmentConfigOptions = {
                    loaders: [
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
                    ],
                    plugins: [
                        new _v.webpack.HotModuleReplacementPlugin(),
                        new _v.webpack.NamedModulesPlugin(),
                        new _v.webpack.LoaderOptionsPlugin({
                            debug: true
                        })
                    ]
                };

                const WebpackShellPlugin = require('webpack-shell-plugin');

                if(JSON.parse(process.env.isElectron)) {
                    //ELECTRON DEV ONLY MODE
                    developmentConfigOptions.plugins = developmentConfigOptions.plugins.concat([
                        new WebpackShellPlugin({
                            onBuildEnd: [`${_v.baseDir}/node_modules/.bin/electron -r babel-register ${_v.cwd}/src/electron.js`]
                        })
                    ]);
                }

                if(JSON.parse(process.env.isWeb) && !JSON.parse(process.env.isElectron)) {
                    //WEB DEV ONLY MODE
                    developmentConfigOptions.plugins = developmentConfigOptions.plugins.concat([
                        new _v.BrowserSyncPlugin(
                            {
                                proxy: `http://localhost:${customConfig.SERVER_PORT}`
                            },
                            {
                                reload: !!customConfig.hotReloadingOptions.BrowserSyncReloadOnChange //Allows hot module reloading to take care of this. (preserves state)
                            }
                        )
                    ]);
                }

                return developmentConfigOptions;
            }
            default: {
                return {
                    loaders: [],
                    plugins: []
                };
            }
        }
    };

    return webpackConfigUtils;
};