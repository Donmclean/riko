const
    _v      = require('../utils/variables')(),
    funcs   = require('../utils/functions')();

module.exports = (runCommand) => {
    const { $, electronPackager, browserSync } = _v;

    funcs.processExitHandler();

    //handle environment variables
    funcs.assignEnvironmentVariablesBasedOnRunCommand(runCommand);

    const customConfig = require('../utils/coreRikoConfig');
    const webpackConfigUtils = require('../utils/webpackConfigUtils')(_v, funcs, customConfig);
    const config = require('../webpack.config');

    //TODO: validate customConfig Here

    switch (runCommand) {
        case 'electron-server': {
            _v.qfs.list(customConfig.output.path).then((files) => {
                switch (_v.os.platform()) {
                    case 'darwin': {
                        //handles open electron app on MAC
                        const macFile = _v._.find(files, (file) => file.match(/\b(darwin)\b/i));

                        if(macFile) {
                            //TODO: fix error here
                            _v.spawn('open', [`-a`, `${_v.cwd}/${_v.path.basename(customConfig.output.path)}/${macFile}/${customConfig.electronPackagerOptions.name}.app`], {stdio: 'inherit'});
                        } else {
                            funcs.logElectronRunServerError();
                        }

                        break;
                    }
                    default: {
                        break;
                    }
                }
            })
                .catch((err) => {
                    funcs.logElectronRunServerError();
                    console.error('ERROR >', err);
                });
            break;
        }
        case 'web-prod': {
            config.entry['index'].unshift('babel-polyfill');

            return _v.webpack(config, (err, stats) => {
                if (err) {
                    funcs.genericLog('Error during compilation...', 'red');
                    console.error(err);
                    throw Error(err);
                }
                funcs.genericLog('build completed successfully!', 'green');
            });
            // return _v.spawn(`${_v.baseDir}/node_modules/.bin/webpack`, [`--config`, `${_v.baseDir}/webpack.config.js`], {stdio: 'inherit'});
        }
        case 'electron-prod': {
            funcs.genericLog('Compiling electron app..');
            if(JSON.parse(process.env.isElectron)) {
                return _v.webpack(config, () => {
                    //Compile The Electron Application
                    const electronPackagerOptions = webpackConfigUtils.getElectronPackagerOptions();
                    electronPackager(electronPackagerOptions, (err) => {
                        if(err) {
                            console.error('ERROR > in electron build', err);
                            throw err;
                        }

                        funcs.removeDir(customConfig.tempDir).then(() => {
                            funcs.genericLog(`${electronPackagerOptions.name} built successfully!`);
                        });
                    });
                });
            }
            break;
        }
        case 'electron-dev':
        case 'web-dev': {
            const stats = funcs.getStats('development');

            //*******************************************************************
            //HOT RELOADING WITH WEBPACK DEV SERVER
            //*******************************************************************

            config.entry['index'].unshift('webpack/hot/dev-server');
            config.entry['index'].unshift(`webpack-dev-server/client?http://localhost:${customConfig.EXPRESS_PORT}`);
            config.entry['index'].unshift('react-hot-loader/patch');
            config.entry['index'].unshift('babel-polyfill');

            const { overlay } = customConfig.hotReloadingOptions;

            new _v.WebpackDevServer(_v.webpack(config), {
                contentBase: config.output.path,
                publicPath: config.output.publicPath,
                historyApiFallback: true,
                hot: true,
                overlay,
                inline: true,
                headers: { 'Access-Control-Allow-Origin': '*' },
                stats
            }).listen(customConfig.EXPRESS_PORT, 'localhost', (err) => {
                if (err) { console.error(err); }
                funcs.genericLog(`Listening at localhost: ${customConfig.EXPRESS_PORT}`);
                funcs.onDevBuildActions(customConfig);
            });

            break;
        }
        case 'node-server-dev': {
            _v.spawn(`${_v.baseDir}/node_modules/.bin/nodemon`, ['--config', `${customConfig.nodemonJson}`, `${customConfig.entryFile}`], {stdio: 'inherit'});
            break;
        }
        case 'node-server-prod': {
            _v.spawn('node', [`${customConfig.entryFile}`], {stdio: 'inherit'});
            break;
        }
        case 'web-server':
        case 'web-prod-server': {
            _v.app.use(_v.morgan('dev'));

            const root = config.output.path;

            _v.app.use(_v.express.static(root));
            _v.app.use(_v.fallback('index.html', { root }));

            _v.app.listen(customConfig.EXPRESS_PORT);

            _v.app.use((err, req, res, next) => {
                funcs.genericLog(`ERROR --> : ${err.stack}`);
                next(err);
            });

            const isProdServer = (runCommand === 'web-prod-server');

            if(isProdServer) {
                funcs.genericLog('Listening on port: ' + customConfig.EXPRESS_PORT, 'yellow');
            } else {
                funcs.genericLog('Launching Browser Sync proxy of port: ' + customConfig.EXPRESS_PORT, 'yellow');

                browserSync.init({
                    proxy: `localhost:${customConfig.EXPRESS_PORT}`
                });
            }

            break;
        }
        default: {
            break;
        }
    }
};