import path from 'path';
import customConfig from './coreRikoConfig';

import { stylesheetProdRules, stylesheetDevRules } from './functions';
import webpack from 'webpack';
import { cwd, baseDir } from './variables';


//Static Webpack Plugins
import BrowserSyncPlugin from 'browser-sync-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebpackNotifierPlugin from 'webpack-notifier';
import WebpackShellPlugin from 'webpack-shell-plugin';

export const getElectronPackagerOptions = () => Object.assign(
    {},

    //Default
    {
        platform: 'all',
        icon: path.resolve(__dirname, '../build-assets/riko-logo.incs')
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

export const getDefaultConfigOptions = (env, configMap) => {
    switch (env) {
        case 'global': {
            const globalConfigOptions = {
                rules: [
                    //JAVASCRIPT
                    {
                        test: /\.jsx$|\.js$/,
                        exclude: /(node_modules|vendor|bower_components)/,
                        loaders: 'babel-loader'
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
                        loader: `file-loader?name=${customConfig.videoOutputPath}/[name].[hash].[ext]`
                    },
                    //AUDIO
                    {
                        test: /\.(wav|mp3|aiff|flac|mp4a|m4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                        loader: `file-loader?name=${customConfig.audioOutputPath}/[name].[hash].[ext]`
                    },
                    //FILES
                    {
                        test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                        loader: `file-loader?name=${customConfig.miscFileOutputPath}/[name].[hash].[ext]`
                    }
                ],

                plugins: [
                    new WebpackNotifierPlugin({contentImage: baseDir+'/build-assets/riko-logo.png'})
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
                rules: [
                    //SASS
                    stylesheetProdRules('sass', /\.scss$/, customConfig, ExtractTextPlugin),
                    //LESS
                    stylesheetProdRules('less', /\.less$/, customConfig, ExtractTextPlugin),
                    //STYLUS
                    stylesheetProdRules('stylus', /\.styl$/, customConfig, ExtractTextPlugin),
                    //CSS
                    stylesheetProdRules('css', /\.css$/, customConfig, ExtractTextPlugin),
                    //FONTS
                    {
                        test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: `file-loader?name=${customConfig.fontOutputPath}/[name].[hash].[ext]`
                    },
                    //IMAGES
                    {
                        test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                        loader: `file-loader?name=${customConfig.imageOutputPath}/[name].[hash].[ext]`
                    }
                ],
                plugins: [
                    new ExtractTextPlugin({
                        filename: 'assets/css/styles.min.[contenthash].css',
                        allChunks: true
                    }),
                    new webpack.SourceMapDevToolPlugin({
                        filename: '[file].map'
                    }),
                    new CleanWebpackPlugin([path.basename(configMap.getIn(['output', 'path']))], {root: customConfig.baseDir, verbose: true, dry: false}),
                    new webpack.LoaderOptionsPlugin({
                        minimize: true,
                        debug: false
                    })
                ]
            };

            const electronPackagerOptions = getElectronPackagerOptions();

            if(JSON.parse(process.env.isElectron)) {
                productionConfigOptions.plugins = productionConfigOptions.plugins.concat([
                    new CopyWebpackPlugin([
                        { from: customConfig.srcDir + '/electron.js', to: customConfig.tempDir },
                        { from: customConfig.srcDir + '/package.json', to: customConfig.tempDir },
                        { from: electronPackagerOptions.icon, to: customConfig.tempDir }
                    ])
                ]);
            }

            return productionConfigOptions;
        }
        case 'development': {
            const developmentConfigOptions = {
                rules: [
                    // SASS
                    stylesheetDevRules('sass', /\.scss$/, customConfig),
                    // LESS
                    stylesheetDevRules('less', /\.less$/, customConfig),
                    //STYLUS
                    stylesheetDevRules('stylus', /\.styl$/, customConfig),
                    // CSS
                    stylesheetDevRules('css', /\.css$/, customConfig),
                    //FONTS
                    {
                        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: "url-loader?mimetype=application/font-woff"
                    },
                    {
                        test: /\.(eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: 'file-loader'
                    },
                    //IMAGES
                    {
                        test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                        loader: 'url-loader'
                    }
                ],
                plugins: [
                    new webpack.HotModuleReplacementPlugin(),
                    new webpack.NamedModulesPlugin(),
                    new webpack.LoaderOptionsPlugin({
                        debug: true
                    })
                ]
            };

            switch (true) {
                case JSON.parse(process.env.isElectron): {
                    //ELECTRON DEV ONLY MODE
                    developmentConfigOptions.plugins = developmentConfigOptions.plugins.concat([
                        new WebpackShellPlugin({
                            onBuildEnd: [`${baseDir}/node_modules/.bin/electron -r babel-register ${cwd}/src/electron.js`]
                        })
                    ]);
                    break;
                }
                case JSON.parse(process.env.isReact): {
                    //WEB DEV ONLY MODE
                    developmentConfigOptions.plugins = developmentConfigOptions.plugins.concat([
                        new BrowserSyncPlugin(
                            {
                                proxy: `http://localhost:${customConfig.SERVER_PORT}`
                            },
                            {
                                reload: customConfig.hotReloadingOptions.browserSyncReloadOnChange //Allows hot module reloading to take care of this. (preserves state)
                            }
                        )
                    ]);
                    break;
                }
                default: {
                    break;
                }
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