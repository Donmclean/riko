const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const autoprefixer = require('autoprefixer');

const baseDir = process.cwd();
const srcDir = `${baseDir}/src`;
const tempDir = `${baseDir}/temp`;
const destDir = `${baseDir}/dist`;

const SERVER_PORT = 3000;

const config = {};

process.traceDeprecation = true;

config.context = baseDir;

config.entry = {
    index: [
        './src/js/index.js'
    ]
};

config.output = {
    filename: '[name].[hash].js',
    path: destDir,
    publicPath: '/'
};

config.resolve = {
    extensions: ['.js', '.jsx', '.json']
};

config.module = {
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
            loader: `file-loader?name=assets/videos/[name].[hash].[ext]`
        },
        //AUDIO
        {
            test: /\.(wav|mp3|aiff|flac|mp4a|m4a|wma|aac|au|rm)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
            loader: `file-loader?name=assets/audio/[name].[hash].[ext]`
        },
        //FILES
        {
            test: /\.(doc|docx|pdf|xls|xlsx|csv|txt)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
            loader: `file-loader?name=assets/files/[name].[hash].[ext]`
        }
    ]
};

config.plugins = [
    new HtmlWebpackPlugin({
        title: 'Riko',

        template: 'src/templates/index.pug',
        favicon: 'src/media/images/riko-favicon.png',
        inject: 'body',
        hash: true,
        cache: true, //default
        showErrors: true, //default

        scripts: [
            // example
            // {
            //     src: 'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
            //     async: false,
            //     defer: false
            // }
        ],
        stylesheets: [
            // 'https://cdnjs.cloudflare.com/ajax/libs/normalize/4.2.0/normalize.min.css'
        ]
    }),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
    })
];

switch (process.env.NODE_ENV) {
    case "production": {
        config.devtool = 'sourcemap';
        config.bail = true;

        const stylesheetProdRules = (type, regex) => ({
            test: new RegExp(regex),
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                allChunks: true,
                use: [
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: () => {
                                return [
                                    autoprefixer({ browsers: ['> 0%'] })
                                ];
                            }
                        }
                    },
                    (type !== 'css') ? {
                        loader: `${type}-loader`,
                        options: {
                            sourceMap: true
                        }
                    } : false
                ].filter(Boolean)
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
            stylesheetProdRules('css', /\.css$/),
            //FONTS
            {
                test: /\.(woff|woff2|eot|ttf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: `file-loader?name=assets/fonts/[name].[hash].[ext]`
            },
            //IMAGES
            {
                test: /\.(jpe?g|png|gif|tif|svg|bmp)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                loader: `file-loader?name=assets/images/[name].[hash].[ext]`
            }
        ]);

        config.plugins = config.plugins.concat([
            new webpack.optimize.UglifyJsPlugin({
                parallel: true,
                mangle: true,
                sourceMap: true
            }),
            new webpack.optimize.CommonsChunkPlugin({
                name: 'index',
                filename: 'assets/js/[name].[hash].min.js'
            }),
            new ExtractTextPlugin({
                filename: 'assets/css/styles.min.[contenthash].css',
                allChunks: true
            }),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map'
            }),
            new CleanWebpackPlugin([destDir], {root: baseDir, verbose: true, dry: false}),
            new webpack.LoaderOptionsPlugin({
                minimize: true,
                debug: false
            })
        ]);

        break;
    }
    case "development": {
        config.devtool = 'inline-source-map';
        config.bail = false;
        config.devServer = {
            port: SERVER_PORT,
            hot: true,
            contentBase: config.output.path,
            publicPath: config.output.publicPath,
            historyApiFallback: true,
            overlay: true,
            inline: true,
            headers: { 'Access-Control-Allow-Origin': '*' }
        };

        config.entry.index = [].concat([
            'react-hot-loader/patch',
            `webpack-dev-server/client?http://localhost:${SERVER_PORT}`,
            'webpack/hot/dev-server'
        ], config.entry.index);

        const stylesheetDevRules = (type, regex) => ({
            test: new RegExp(regex),
            loaders: [
                'style-loader',
                `css-loader${config.devtool ? '?sourceMap' : ''}`,
                {
                    loader: 'postcss-loader',
                    options: {
                        sourceMap: !!config.devtool,
                        plugins: () => {
                            return [
                                autoprefixer({ browsers: ['> 0%'] })
                            ];
                        }
                    }
                },
                (type !== 'css') ? `${type}-loader${!!config.devtool ? '?sourceMap' : ''}` : false
            ].filter(Boolean)
        });

        config.module.rules = config.module.rules.concat([
            // SASS
            stylesheetDevRules('sass', /\.scss$/),
            // LESS
            stylesheetDevRules('less', /\.less$/),
            //STYLUS
            stylesheetDevRules('stylus', /\.styl$/),
            // CSS
            stylesheetDevRules('css', /\.css$/),
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
        ]);

        config.plugins = config.plugins.concat([
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin(),
            new webpack.LoaderOptionsPlugin({
                debug: true
            })
        ]);

        break;
    }
    default: {
        break;
    }
}

//<--------------------------------------------------------------->
//<------------------- PLATFORM SPECIFICS ------------------------>
//<--------------------------------------------------------------->
const handlePlatformSpecifics = () => {
    if(process.env.isElectron === 'true') {
        config.output.path = tempDir;
        config.output.publicPath = '';

        switch (process.env.NODE_ENV) {
            case 'production': {
                config.plugins = config.plugins.concat([
                    new CopyWebpackPlugin([
                        { from: `${srcDir}/electron.js`, to: tempDir },
                        { from: `${srcDir}/package.json`, to: tempDir },
                        { from: `${srcDir}/riko-logo.icns`, to: tempDir }
                    ])
                ]);
                break;
            }
            case 'development': {
                config.plugins = config.plugins.concat([
                    new WebpackShellPlugin({
                        onBuildEnd: [`${baseDir}/node_modules/.bin/electron -r babel-register ${baseDir}/src/electron.js`]
                    })
                ]);
                break;
            }
            default: {
                break;
            }
        }
    } else {
        switch (process.env.NODE_ENV) {
            case 'production': {
                break;
            }
            case 'development': {
                config.plugins = config.plugins.concat([
                    new BrowserSyncPlugin(
                        {
                            proxy: `http://localhost:${SERVER_PORT}`,
                            port: SERVER_PORT + 1
                        },
                        {
                            reload: false
                        }
                    )
                ]);
                break;
            }
            default: {
                break;
            }
        }
    }
};

handlePlatformSpecifics();

module.exports = config;