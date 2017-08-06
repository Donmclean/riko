import { processExitHandler, assignEnvironmentVariablesBasedOnRunCommand, doRunCommandValidations, logElectronRunServerError,
    removeDir, genericLog, getStats, onDevBuildActions } from '../utils/functions';
import { cwd, baseDir } from '../utils/variables';
import { getElectronPackagerOptions } from '../utils/webpackConfigUtils';
import qfs from 'q-io/fs';
import os from 'os';
import path from 'path';
import { find } from 'lodash';
import { runCommands } from '../constants/index';
import spawn from 'cross-spawn';
const spawnSync = spawn.sync;

export default (runCommand) => {
    //add exit handler
    processExitHandler();

    //assign environment variables
    assignEnvironmentVariablesBasedOnRunCommand(runCommands, runCommand);

    const requiresWebpack = (JSON.parse(process.env.isReact) || JSON.parse(process.env.isElectron));

    doRunCommandValidations();

    const modulesToImport = [ import('../utils/coreRikoConfig').then((m) => m.default) ];

    if(requiresWebpack) {
        modulesToImport.push(import('../webpack.config.babel').then((m) => m.default));
    }

    Promise.all(modulesToImport).then((modules) => {
        const [ customConfig, config = {} ] = modules;

        //TODO: validate customConfig Here
        //TODO: extract these dependencies

        switch (runCommand) {
            case 'electron-server': {
                qfs.list(customConfig.output.path).then((files) => {
                    switch (os.platform()) {
                        case 'darwin': {
                            //handles open electron app on MAC
                            const macFile = find(files, (file) => file.match(/\b(darwin)\b/i));

                            if(macFile) {
                                spawn('open', [`-a`, `${cwd}/${path.basename(customConfig.output.path)}/${macFile}/${customConfig.electronPackagerOptions.name}.app`], {stdio: 'inherit'});
                            } else {
                                logElectronRunServerError();
                            }

                            break;
                        }
                        default: {
                            break;
                        }
                    }
                })
                    .catch((err) => {
                        logElectronRunServerError();
                        console.error('ERROR >', err);
                    });
                break;
            }
            case 'react-prod': {
                config.entry['index'].unshift('babel-polyfill');

                //TODO: validate command below
                return spawn(`${customConfig.baseDir}/node_modules/.bin/webpack`, [`--config`, `${path.resolve(__dirname, '../webpack.config.babel.js')}`], {stdio: 'inherit'});
            }
            case 'electron-prod': {
                genericLog('Compiling electron app..');

                if(JSON.parse(process.env.isElectron)) {
                    // const electronPackager = require('electron-packager'); //TODO: use dynamic import here
                    return import('electron-packager')
                        .then((electronPackager) => {
                            const spawned = spawn(`${customConfig.baseDir}/node_modules/.bin/webpack`, [`--config`, `${path.resolve(__dirname, '../webpack.config.babel.js')}`], {stdio: 'inherit'});

                            spawned.on('close', () => {
                                //Compile The Electron Application
                                const electronPackagerOptions = getElectronPackagerOptions();
                                electronPackager(electronPackagerOptions, (err) => {
                                    if(err) {
                                        console.error('ERROR > in electron build', err);
                                        throw err;
                                    }

                                    removeDir(customConfig.tempDir).then(() => {
                                        genericLog(`${electronPackagerOptions.name} built successfully!`);
                                    });
                                });
                            });

                            return spawn;
                        });
                }
                break;
            }
            case 'react-native-ios': {
                return spawn('react-native', ['run-ios'], {stdio: 'inherit'});
            }
            case 'react-native-launch-android': {
                genericLog('launching android emulator...', 'blue');
                return spawn(`sh`, [`${cwd}/launch-android-Emulator.sh`, '&'], {stdio: 'ignore'});
            }
            case 'react-native-android': {
                return spawnSync('react-native', ['run-android'], {stdio: 'inherit'});
            }
            case 'electron-dev':
            case 'react-dev': {
                const stats = getStats('development');
                const webpack = require('webpack');
                const webpackDevServer = require('webpack-dev-server');

                //*******************************************************************
                //HOT RELOADING WITH WEBPACK DEV SERVER
                //*******************************************************************

                config.entry['index'].unshift('webpack/hot/dev-server');
                config.entry['index'].unshift(`webpack-dev-server/client?http://localhost:${customConfig.SERVER_PORT}`);
                config.entry['index'].unshift('react-hot-loader/patch');
                config.entry['index'].unshift('babel-polyfill');

                const { overlay } = customConfig.hotReloadingOptions;

                new webpackDevServer(webpack(config), {
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
                    genericLog(`Listening at localhost: ${customConfig.SERVER_PORT}`);
                    onDevBuildActions(customConfig);
                });

                break;
            }
            case 'node-server-dev': {
                spawn(`${baseDir}/node_modules/.bin/nodemon`, ['--config', `${customConfig.nodemonJson}`, `${customConfig.entryFile}`], {stdio: 'inherit'});
                break;
            }
            case 'node-server-prod': {
                spawn('node', [`${customConfig.entryFile}`], {stdio: 'inherit'});
                break;
            }
            case 'react-server':
            case 'react-prod-server': {
                //TODO: use dynamic import
                const browserSync   = require('browser-sync');
                const morgan        = require('morgan');
                const fallback      = require('express-history-api-fallback');
                const express       = require('express');
                const app           = require('express')();

                app.use(morgan('dev'));

                const root = config.output.path;

                app.use(express.static(root));
                app.use(fallback('index.html', { root }));

                const portToServe = process.argv[4] || customConfig.SERVER_PORT;

                app.listen(portToServe);

                app.use((err, req, res, next) => {
                    genericLog(`ERROR --> : ${err.stack}`);
                    next(err);
                });

                const isProdServer = (runCommand === 'react-prod-server');

                if(isProdServer) {
                    genericLog('Listening on port: ' + portToServe, 'yellow');
                } else {
                    genericLog('Launching Browser Sync proxy of port: ' + portToServe, 'yellow');

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
    });
};