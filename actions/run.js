const
    _v = require('../utils/variables')(),
    funcs = require('../utils/functions')(),
    { runCommands } = require('../constants/index');

module.exports = (runCommand) => {
    const { electronPackager, browserSync } = _v;

    //add exit handler
    funcs.processExitHandler();

    //assign environment variables
    funcs.assignEnvironmentVariablesBasedOnRunCommand(runCommands, runCommand);

    const requiresWebpack = (JSON.parse(process.env.isReact) || JSON.parse(process.env.isElectron));

    funcs.doRunCommandValidations();

    const customConfig = require('../utils/coreRikoConfig');
    //TODO: validate customConfig Here
    //TODO: extract these dependecies
    const webpackConfigUtils = requiresWebpack ? require('../utils/webpackConfigUtils')(_v, funcs, customConfig): {};
    const config = requiresWebpack ? require('../webpack.config') : {};

    switch (runCommand) {
        case 'electron-server': {
            _v.qfs.list(customConfig.output.path).then((files) => {
                switch (_v.os.platform()) {
                    case 'darwin': {
                        //handles open electron app on MAC
                        const macFile = _v._.find(files, (file) => file.match(/\b(darwin)\b/i));

                        if(macFile) {
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
        case 'react-prod': {
            config.entry['index'].unshift('babel-polyfill');

            return _v.spawn(`${customConfig.baseDir}/node_modules/.bin/webpack`, [`--config`, `${_v.baseDir}/webpack.config.js`], {stdio: 'inherit'});
        }
        case 'electron-prod': {
            funcs.genericLog('Compiling electron app..');
            if(JSON.parse(process.env.isElectron)) {
                const spawn = _v.spawn(`${customConfig.baseDir}/node_modules/.bin/webpack`, [`--config`, `${_v.baseDir}/webpack.config.js`], {stdio: 'inherit'});

                spawn.on('close', () => {
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

                return spawn;
            }
            break;
        }
        case 'react-native-ios': {
            return _v.spawn('react-native', ['run-ios'], {stdio: 'inherit'});
        }
        case 'react-native-launch-android': {
            funcs.genericLog('launching android emulator...', 'blue');
            return _v.spawn(`sh`, [`${_v.cwd}/launch-android-Emulator.sh`, '&'], {stdio: 'ignore'});
        }
        case 'react-native-android': {
            return _v.spawnSync('react-native', ['run-android'], {stdio: 'inherit'});
        }
        case 'electron-dev':
        case 'react-dev': {
            const stats = funcs.getStats('development');

            //*******************************************************************
            //HOT RELOADING WITH WEBPACK DEV SERVER
            //*******************************************************************

            config.entry['index'].unshift('webpack/hot/dev-server');
            config.entry['index'].unshift(`webpack-dev-server/client?http://localhost:${customConfig.SERVER_PORT}`);
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
            }).listen(customConfig.SERVER_PORT, 'localhost', (err) => {
                if (err) { console.error(err); }
                funcs.genericLog(`Listening at localhost: ${customConfig.SERVER_PORT}`);
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
        case 'react-server':
        case 'react-prod-server': {
            _v.app.use(_v.morgan('dev'));

            const root = config.output.path;

            _v.app.use(_v.express.static(root));
            _v.app.use(_v.fallback('index.html', { root }));

            const portToServe = process.argv[4] || customConfig.SERVER_PORT;

            _v.app.listen(portToServe);

            _v.app.use((err, req, res, next) => {
                funcs.genericLog(`ERROR --> : ${err.stack}`);
                next(err);
            });

            const isProdServer = (runCommand === 'react-prod-server');

            if(isProdServer) {
                funcs.genericLog('Listening on port: ' + portToServe, 'yellow');
            } else {
                funcs.genericLog('Launching Browser Sync proxy of port: ' + portToServe, 'yellow');

                browserSync.init({
                    proxy: `localhost:${portToServe}`
                });
            }

            break;
        }
        default: {
            break;
        }
    }
};