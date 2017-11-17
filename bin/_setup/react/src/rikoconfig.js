module.exports = () => {
    return {
        setWebpackConfig: () => {
            //return an object with the following keys 'webpack', 'webpackDevServer', 'webpackConfig'
            //i.e: { webpack: require('webpack'), webpackDevServer: require('webpack-dev-server'), webpackConfig: require('../webpack.config.babel')}

            const webpack = require('webpack');
            const webpackDevServer = require('webpack-dev-server');
            const webpackConfig = require('../webpack.config.babel');

            return { webpack, webpackDevServer, webpackConfig };
        },

        setCustomBoilerplatePath: () => {
            //return a string which is the relative path to your custom boilerplate directory
            //return false to disable custom boilerplate creation
            return 'src/riko-custom-boilerplates';
        },

        setWebpackEventHooks: (NODE_ENV) => {
            //return an object with the keys as the event names and the values as the event callback functions
            //see here for more details: https://webpack.js.org/api/compiler/#event-hooks

            //i.e:
            // return {
            //     'before-compile': (compilation, callback) => {
            //         // Do something async on the before-compile event...
            //         callback();
            //     }
            // };

            return {};
        },

        setElectronPackagerOptions: () => {
            //return an object containing electron packager options
            //for Electron Applications Only
            //See API for all options here: https://github.com/electron-userland/electron-packager/blob/master/docs/api.md
            return {
                name: 'Riko',
        
                //applications icon  //OS X: .icns  //Windows: .ico
                //get free conversions herehttps://iconverticons.com/online/
                icon: 'src/riko-logo.icns',
        
                //target platform(s) to build for
                platform: 'all',
        
                //Enable or disable asar archiving
                asar: true
            }
        }
    }
};