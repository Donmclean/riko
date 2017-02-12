"use strict";
const config = require('./webpack.config');
const customConfig = require('./webpack/config') || {};
const browserSync = require('browser-sync');

const _v = customConfig.vars;
const funcs = require('./webpack/functions')(_v);
const packager = require('electron-packager');

switch (_v.NODE_ENV) {
    case "development": {
        const stats = funcs.getStats(_v.NODE_ENV);

        if(customConfig.useWebpackDevMiddleWareInsteadOfDevServer) {
            //*******************************************************************
            //HOT RELOADING WITH EXPRESS SERVER + WEBPACK HOT & DEV MIDDLEWARES
            //*******************************************************************

            const compiler = _v.webpack(config, funcs.webpackCompilationErrorHandler);

            if(customConfig.hotReloadingOptions && !_v._.isEmpty(customConfig.hotReloadingOptions)) {
                const { overlay, reload, noInfo, quiet } = customConfig.hotReloadingOptions;
                config.entry[customConfig.moduleName].unshift(`webpack-hot-middleware/client?overlay=${overlay}&reload=${reload}&noInfo=${noInfo}&quiet=${quiet}`);
            } else {
                config.entry[customConfig.moduleName].unshift(`webpack-hot-middleware/client?overlay=true&reload=true&noInfo=false&quiet=false`);
            }

            _v.app.use(_v.historyApiFallback({
                verbose: false
            }));

            const webpackDevMiddlewareInstance = _v.WebpackDevMiddleware(compiler, {
                contentBase: config.output.path,
                publicPath: config.output.publicPath,
                hot: true,
                headers: { 'Access-Control-Allow-Origin': '*' },
                stats
            });

            _v.app.use(webpackDevMiddlewareInstance);

            //Initial (Runs once) end of valid build callback
            webpackDevMiddlewareInstance.waitUntilValid(() => {
                funcs.onDevBuildActions(customConfig);
            });

            //Repeating end of valid/invalid build callback
            // compiler.plugin('done', () => { ... });

            _v.app.use(_v.WebpackHotMiddleware(compiler));

            //Only run web server in template-based application. eg: web or electron.
            if(customConfig.requiresTemplate) {
                _v.app.listen(customConfig.EXPRESS_PORT, 'localhost', (err) => {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Listening at localhost:' + customConfig.EXPRESS_PORT);
                });
            }
        } else {
            //*******************************************************************
            //HOT RELOADING WITH WEBPACK DEV SERVER
            //*******************************************************************

            config.entry[customConfig.moduleName].unshift('webpack/hot/dev-server');
            config.entry[customConfig.moduleName].unshift('webpack-dev-server/client?http://localhost:'+customConfig.EXPRESS_PORT);

            new _v.WebpackDevServer(_v.webpack(config), {
                contentBase: config.output.path,
                publicPath: config.output.publicPath,
                historyApiFallback: true,
                hot: true,
                inline: true,
                headers: { 'Access-Control-Allow-Origin': '*' },
                stats
            }).listen(customConfig.EXPRESS_PORT, 'localhost', (err) => {
                if (err) { console.log(err); }
                console.log('Listening at localhost:' + customConfig.EXPRESS_PORT);
                funcs.onDevBuildActions(customConfig);
            });
        }

        break;
    }
    default: {

        if(process.env.ELECTRON) {
            _v.webpack(config, () => {
                //Compile The Electron Application
                packager(customConfig.electronPackagingOptions, (err) => {
                    "use strict";
                    if(err) {
                        console.error('ERROR > in electron build', err);
                        throw err;
                    }

                    funcs.removeDir(customConfig.tempDir).then(() => {
                        console.log(customConfig.electronPackagingOptions.name + " build successfully!");
                    });
                });
            });
            break;
        }

        _v.app.use(_v.morgan('dev'));

        const root = customConfig.destDir;
        _v.app.use(_v.express.static(root));
        _v.app.use(_v.fallback('index.html', { root }));

        _v.app.listen(customConfig.EXPRESS_PORT);

        _v.app.use((err, req, res, next) => {
            console.error("ERROR --> : ", err.stack);
            next(err);
        });

        let isLiveServer;

        try {
            isLiveServer = JSON.parse(process.env.LIVE);
        } catch (err) {
            isLiveServer = false;
        }

        if(!isLiveServer) {
            console.log('Launching Browser Sync proxy of port: ' + customConfig.EXPRESS_PORT);

            browserSync.init({
                proxy: 'localhost:' + customConfig.EXPRESS_PORT
            });
        } else {
            console.log('Listening on port: ' + customConfig.EXPRESS_PORT);
        }

        break;
    }
}
