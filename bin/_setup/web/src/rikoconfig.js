//**********************************************************************
//*******************************CUSTOM*********************************
//**********************************************************************
//IMPORTANT! All paths/directories should be relative to 'BASE DIRECTORY' unless specified otherwise.
//BASE DIRECTORY is same location as package.json file.
const cwd = process.cwd();

const config = {
    entry: {
        index: [ './src/js/index.js' ]
    },
    output: {
        path: `${cwd}/dist`
    },

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
    }
};

//**********************************************************************
//****************************EXTERNALS*********************************
//**********************************************************************

// To add vendor dependencies and expose them to global/window object simply use the expose-loader
// eg: require("expose-loader?_!lodash");
// see: https://github.com/webpack/expose-loader

//**********************************************************************
//*******************************EXTRAS*********************************
//**********************************************************************
config.EXPRESS_PORT = 3000;

config.hotReloadingOptions     = {
    overlay: true,

    //Override hot module replacement and simply have the page refresh on file change
    BrowserSyncReloadOnChange: false,

    //Provide an npm package.json script command here to have tests execute on every webpack rebuild.
    //i.e: 'test' would execute as 'npm run test' or 'hot-test' as 'npm run hot-test'
    hotExecuteTestCommand: 'test',

    hotExecuteFlowTypeCommand: 'default'
};

//https://webpack.github.io/docs/configuration.html#devtool
config.sourcemapType = 'source-map';

//Enable of disable sourcemaps
config.sourcemapDev = true;
config.sourcemapProd = true;

config.autoprefixerOptions     = { browsers: ['> 0%'] }; //prefix everything: browsers: ['> 0%']

//specific custom boilerplate path for generating path boilerplate files via the `riko <create>` command.
//path must be relative to package.json.
config.customBoilerplatePath = 'src/riko-custom-boilerplates';

module.exports = config;