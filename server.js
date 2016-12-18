"use strict";
import config from './webpack.config';
import browserSync from 'browser-sync';

const _v = config.vars;
const funcs = require('./webpack/functions')(_v);
const packager = require('electron-packager');

switch (_v.NODE_ENV) {
    case "development": {

        //*******************************************************************
        //HOT RELOADING WITH EXPRESS SERVER + WEBPACK HOT & DEV MIDDLEWARES
        //*******************************************************************

        const stats = {
            colors: true, hash: true, version: true, timings: true, assets: false,
            chunks: false, modules: false, reasons: false, children: false, source: false,
            errors: true, errorDetails: true, warnings: true, publicPath: false
        };

        const compiler = _v.webpack(config);

        if(config.hotReloadingOptions && !_v._.isEmpty(config.hotReloadingOptions)) {
            const { overlay, reload, noInfo, quiet } = config.hotReloadingOptions;
            config.entry.unshift(`webpack-hot-middleware/client?overlay=${overlay}&reload=${reload}&noInfo=${noInfo}&quiet=${quiet}`);
        } else {
            config.entry.unshift(`webpack-hot-middleware/client?overlay=true&reload=true&noInfo=false&quiet=false`);
        }

        _v.app.use(_v.historyApiFallback({
            verbose: false
        }));

        const webpackDevMiddlewareInstance = _v.WebpackDevMiddleware(compiler, {
            contentBase: config.output.path,
            publicPath: config.output.publicPath,
            hot: true,
            headers: { 'Access-Control-Allow-Origin': '*' },
            stats: stats
        });

        _v.app.use(webpackDevMiddlewareInstance);

        //Initial (Runs once) end of valid build callback
        webpackDevMiddlewareInstance.waitUntilValid(() => {
            console.log('Updating Source File Watcher executing initial tests...');

            const watcher = _v.chokidar.watch(config.srcFiles, {ignored: /[\/\\]\./});

            watcher.on('change', () => {
                const spawn = config.hotExecuteTests ? funcs.executeJestTests() : null;

                if(spawn) {
                    spawn.on('close', funcs.runFlow);
                }
            });

            const spawn = funcs.executeJestTests();
            spawn.on('close', funcs.runFlow);
        });

        //Repeating end of valid/invalid build callback
        // compiler.plugin('done', () => { ... });

        _v.app.use(_v.WebpackHotMiddleware(compiler));

        //Only run web server in template-based application. eg: web or electron.
        if(config.requiresTemplate) {
            _v.app.listen(config.EXPRESS_PORT, 'localhost', (err) => {
                if (err) {
                    console.log(err);
                }
                console.log('Listening at localhost:' + config.EXPRESS_PORT);
            });
        }

        //*******************************************************************
        //HOT RELOADING WITH WEBPACK DEV SERVER
        //*******************************************************************

        // config.entry.unshift('webpack/hot/dev-server');
        // config.entry.unshift('webpack-dev-server/client?http://localhost:'+config.EXPRESS_PORT);
        //
        // new _v.WebpackDevServer(_v.webpack(config), {
        //     contentBase: config.output.path,
        //     publicPath: config.output.publicPath,
        //     historyApiFallback: true,
        //     hot: true,
        //     inline: true,
        //     headers: { 'Access-Control-Allow-Origin': '*' },
        //     stats: stats
        // }).listen(config.EXPRESS_PORT, 'localhost', function (err, result) {
        //     if (err) { console.log(err) }
        //     console.log('Listening at localhost:'+config.EXPRESS_PORT);
        // });

        break;
    }
    default: {

        if(process.env.ELECTRON) {
            _v.webpack(config, () => {
                //Compile The Electron Application
                packager(config.electronPackagingOptions, function(err) {
                    "use strict";
                    if(err) {
                        console.error('ERROR > in electron build', err);
                        throw err;
                    }

                    funcs.removeDir(config.tempDir).then(() => {
                        console.log(config.electronPackagingOptions.name + " build successfully!");
                    });
                });
            });
            break;
        }

        _v.app.use(_v.morgan('dev'));

        const root = config.destDir;
        _v.app.use(_v.express.static(root));
        _v.app.use(_v.fallback('index.html', { root }));

        _v.app.listen(config.EXPRESS_PORT);

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
            console.log('Launching Browser Sync proxy of port: ' + config.EXPRESS_PORT);

            browserSync.init({
                proxy: 'localhost:' + config.EXPRESS_PORT
            });
        } else {
            console.log('Listening on port: ' + config.EXPRESS_PORT);
        }

        break;
    }
}
