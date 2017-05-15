//**********************************************************************
//*******************************CUSTOM*********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'BASE DIRECTORY' unless specified otherwise.
//BASE DIRECTORY is same location as package.json file.
const cwd = process.cwd();

const config = {
    SERVER_PORT: 3000,

    entry: {
        index: [ './src/js/index.js' ]
    },

    output: {
        path: `${cwd}/dist`
    },

    //https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'source-map',

    setWebpackConfigOptions: (env, config, webpack, immutable) => {
        const HtmlWebpackPlugin = require('html-webpack-plugin');

        switch (env) {
            case 'global': {
                config.set('plugins', [
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
                ]);
                break;
            }
            case 'production': {
                config.set('plugins', [
                    new webpack.optimize.UglifyJsPlugin({
                        mangle: false,
                        sourceMap: true
                    }),
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'index',
                        filename: 'assets/js/[name].js?[hash]'
                    })
                ]);
                break;
            }
            case 'development': {
                break;
            }
            default: {
                break;
            }
        }
    },

    //**********************************************************************
    //*******************************ELECTRON*******************************
    //**********************************************************************
    //for Electron Applications Only
    //See API for all options here: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
    electronPackagerOptions: {
        name: 'Riko',

        //applications icon  //OS X: .icns  //Windows: .ico
        //get free conversions herehttps://iconverticons.com/online/
        icon: 'src/riko-logo.icns',

        //target platform(s) to build for
        platform: 'all',

        //Enable or disable asar archiving
        asar: true
    },
    //**********************************************************************

    hotReloadingOptions: {
        overlay: true,

        //Override hot module replacement and simply have the page refresh on file change
        BrowserSyncReloadOnChange: false,

        //Provide an npm package.json script command here to have tests execute on every webpack rebuild.
        //i.e: 'test' would execute as 'npm run test' or 'hot-test' as 'npm run hot-test'
        hotExecuteTestCommand: 'test',

        hotExecuteFlowTypeCommand: 'default'
    },

    //prefix everything: browsers: ['> 0%']
    autoprefixerOptions: {
        browsers: ['> 0%']
    },

    //specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
    //path must be relative to package.json.
    customBoilerplatePath: 'src/riko-custom-boilerplates'
};

//**********************************************************************
//****************************EXTERNALS*********************************
//**********************************************************************

// To add vendor dependencies and expose them to global/window object simply use the expose-loader
// eg: require("expose-loader?_!lodash");
// see: https://github.com/webpack/expose-loader

module.exports = config;