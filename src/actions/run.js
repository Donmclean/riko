import { processExitHandler, assignEnvironmentVariablesBasedOnRunCommand, doRunCommandValidations, logElectronRunServerError,
    removeDir, genericLog, getStats, onDevBuildActions, checkForNewPackageVersion, setEntryHelper } from '../utils/functions';
import { cwd, baseDir } from '../utils/variables';
import { getElectronPackagerOptions } from '../utils/webpackConfigUtils';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { find } from 'lodash';
import { runCommands } from '../constants/index';
import spawn from 'cross-spawn';
const spawnSync = spawn.sync;

export default async (runCommand) => {
    //add exit handler
    processExitHandler();

    checkForNewPackageVersion();

    //assign environment variables
    assignEnvironmentVariablesBasedOnRunCommand(runCommands, runCommand);

    const requiresWebpack = (JSON.parse(process.env.isReact) || JSON.parse(process.env.isElectron));

    doRunCommandValidations();

    const modulesToImport = [ import('../utils/coreRikoConfig').then((m) => m.default) ];

    if(requiresWebpack) {
        modulesToImport.push(import('../webpack.config.babel').then((m) => m.default));
    }

    const [ customConfig, config = {} ] = await Promise.all(modulesToImport).catch((err) => console.error('err > ', err));

    //TODO: validate customConfig Here
    //TODO: extract these dependencies

    switch (runCommand) {
        case 'electron-server': {
            let electronDistfiles;

            try {
                electronDistfiles = await fs.readdir(customConfig.output.path);

                switch (os.platform()) {
                    case 'darwin': {
                        //handles open electron app on MAC
                        const macFile = find(electronDistfiles, (file) => file.match(/\b(darwin)\b/i));

                        if(macFile) {
                            spawn('open', [`-a`, `${cwd}/${path.basename(customConfig.output.path)}/${macFile}/${customConfig.electronPackagerOptions.name}.app`], {stdio: 'inherit'});
                        } else {
                            logElectronRunServerError();
                        }

                        break;
                    }
                    //TODO: add support for more os platforms like: Windows, Linux.
                    default: {
                        break;
                    }
                }

            } catch (err) {
                logElectronRunServerError();
                console.error(`ERROR > error reading customConfig.output.path (${customConfig.output.path})`, err);
            }

            break;
        }
        case 'react-prod': {
            //TODO: validate command below
            return spawn(`${customConfig.baseDir}/node_modules/.bin/webpack`, [`--config`, `${path.resolve(__dirname, '../webpack.config.babel.js')}`], {stdio: 'inherit'});
        }
        case 'electron-prod': {
            genericLog('Compiling electron app..');

            if(JSON.parse(process.env.isElectron)) {
                const electronPackager = await import('electron-packager');

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

                return new Promise((resolve) => resolve(spawned));
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

            config.entry = setEntryHelper(customConfig);

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
};