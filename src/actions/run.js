import { processExitHandler, assignEnvironmentVariablesBasedOnRunCommand, doRunCommandValidations, validateRikoConfig,
    logElectronRunServerError, removeDir, genericLog, checkForNewPackageVersion, getElectronPackagerOptions,
    applyWebpackEventHooks } from '../utils/functions';
import { cwd, baseDir } from '../utils/variables';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { find } from 'lodash';
import { runCommands } from '../constants';
import spawn from 'cross-spawn';
const spawnSync = spawn.sync;

export default async (runCommand) => {
    //add exit handler
    processExitHandler();

    checkForNewPackageVersion();

    //assign environment variables
    assignEnvironmentVariablesBasedOnRunCommand(runCommands, runCommand);

    doRunCommandValidations();

    const { rikoConfig, config} = await import('../utils/coreRikoConfig').then((m) => m.default);

    validateRikoConfig(rikoConfig, runCommand);

    //TODO: extract these cases in functional components
    switch (runCommand) {
        case 'electron-server': {
            process.env.NODE_ENV = 'production';
            const { webpackConfig } = rikoConfig.setWebpackConfig('electron');
            let electronDistfiles;

            try {
                const electronPackagerOptions = getElectronPackagerOptions(rikoConfig.setElectronPackagerOptions(), webpackConfig, config);
                electronDistfiles = await fs.readdir(electronPackagerOptions.out);

                switch (os.platform()) {
                    case 'darwin': {
                        //handles open electron app on MAC
                        const macFile = find(electronDistfiles, (file) => file.match(/\b(darwin)\b/i));

                        if(macFile && electronPackagerOptions) {
                            spawn('open', [`-a`, `${cwd}/${path.basename(electronPackagerOptions.out)}/${macFile}/${electronPackagerOptions.name}.app`], {stdio: 'inherit'});
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
                console.error(`ERROR > error reading electronPackagerOptions out path`, err);
            }

            break;
        }
        case 'react-prod': {
            const { webpack, webpackConfig } = rikoConfig.setWebpackConfig('web');

            const webpackEventHooks = rikoConfig.setWebpackEventHooks(process.env.NODE_ENV);

            const compiler = applyWebpackEventHooks(webpackEventHooks, webpack(webpackConfig));

            return compiler.run((err, stats) => {
                if(err) {
                    console.error('ERROR > webpack compilation > : ', err);
                } else {
                    process.stdout.write(stats.toString() + "\n");
                }
            });
        }
        case 'electron-prod': {
            const { webpack, webpackConfig } = rikoConfig.setWebpackConfig('electron');
            const electronPackagerOptions = getElectronPackagerOptions(rikoConfig.setElectronPackagerOptions(), webpackConfig, config);

            if(JSON.parse(process.env.isElectron) && electronPackagerOptions) {
                const electronPackager = await import('electron-packager');
                const createDMG = await import('electron-installer-dmg');

                genericLog('Compiling js build assets...');

                return webpack(webpackConfig, (err, stats) => {
                    if(err) {
                        console.error('ERROR: ', err);
                    } else {
                        process.stdout.write(stats.toString() + "\n");

                        //Compile The Electron Application
                        genericLog('Compiling electron app...');
                        electronPackager(electronPackagerOptions, async (err) => {
                            if(err) {
                                console.error('ERROR > electronPackager > in electron build', err);
                                throw err;
                            } else {
                                //build is targeting mac platform
                                const isTargetingMacPlatform = (electronPackagerOptions.platform === 'all' || electronPackagerOptions.platform === 'darwin');

                                if(isTargetingMacPlatform) {
                                    const electronDistfiles = await fs.readdir(electronPackagerOptions.out);
                                    const macFile = find(electronDistfiles, (file) => file.match(/\b(darwin)\b/i));

                                    const dmgOptions = {
                                        name: electronPackagerOptions.name,
                                        appPath: `${cwd}/${path.basename(electronPackagerOptions.out)}/${macFile}/${electronPackagerOptions.name}.app`,
                                        debug: true,
                                        overwrite: true,
                                        out: electronPackagerOptions.out,
                                        icon: electronPackagerOptions.icon
                                    };

                                    createDMG(dmgOptions, (err) => {
                                        if(err) {
                                            console.error('ERROR > createDMG > in electron build', err);
                                            throw err;
                                        }
                                        genericLog(`DMG for ${electronPackagerOptions.name} built successfully!`);
                                        removeDir(config.tempDir).then(() => {
                                            genericLog(`${electronPackagerOptions.name} built successfully!`);
                                        });
                                    });
                                } else {
                                    removeDir(config.tempDir).then(() => {
                                        genericLog(`${electronPackagerOptions.name} built successfully!`);
                                    });
                                }
                            }
                        });
                    }
                });
            } else if(!electronPackagerOptions) {
                genericLog(`ERROR: no electronPackagerOptions object is undefined port number... `, 'red');
            } else {
                genericLog('ERROR: internal riko error occured... Please report issue', 'red');
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
            //*******************************************************************
            //HOT RELOADING WITH WEBPACK DEV SERVER
            //*******************************************************************

            const rikoConfigWebpackValues = rikoConfig.setWebpackConfig('web');
            const { webpack, webpackConfig, webpackDevServer } = rikoConfigWebpackValues;

            const webpackEventHooks = rikoConfig.setWebpackEventHooks(process.env.NODE_ENV);

            config.SERVER_PORT = webpackConfig.devServer.port ? webpackConfig.devServer.port : config.SERVER_PORT;

            if(config.SERVER_PORT) {
                //apply webpackEventHooks
                const compiler = applyWebpackEventHooks(webpackEventHooks, webpack(webpackConfig));

                new webpackDevServer(compiler, webpackConfig.devServer).listen(config.SERVER_PORT, 'localhost', (err) => {
                    if (err) { console.error(err); }
                    genericLog(`Launching webpack devServer on ${config.SERVER_PORT}...`);
                });

            } else {
                genericLog('ERROR: missing port number... ', 'red');
                genericLog(`i.e: riko r ${runCommand} <port>`, 'red');
            }

            break;
        }
        case 'node-server-dev': {
            spawn(`${baseDir}/node_modules/.bin/nodemon`, ['--config', `${rikoConfig.nodemonJson}`, `${rikoConfig.entryFile}`], {stdio: 'inherit'});
            break;
        }
        case 'node-server-prod': {
            spawn('node', [`${rikoConfig.entryFile}`], {stdio: 'inherit'});
            break;
        }
        case 'react-server':
        case 'react-prod-server': {
            const browserSync   = require('browser-sync');
            const morgan        = require('morgan');
            const fallback      = require('express-history-api-fallback');
            const express       = require('express');
            const app           = express();

            app.use(morgan('dev'));

            const { webpackConfig } = rikoConfig.setWebpackConfig('web');

            const customRootToBeServed = process.argv[5];
            const root = customRootToBeServed ? path.resolve(cwd, customRootToBeServed) : webpackConfig.output.path;

            app.use(express.static(root));
            app.use(fallback('index.html', { root }));

            if(config.SERVER_PORT) {
                app.listen(config.SERVER_PORT);

                app.use((err, req, res, next) => {
                    genericLog(`ERROR --> : ${err.stack}`);
                    next(err);
                });

                const isProdServer = (runCommand === 'react-prod-server');

                if(isProdServer) {
                    genericLog('Listening on port: ' + config.SERVER_PORT, 'yellow');
                } else {
                    genericLog('Launching Browser Sync proxy of port: ' + config.SERVER_PORT, 'yellow');

                    browserSync.init({
                        proxy: `localhost:${config.SERVER_PORT}`,
                        port: config.SERVER_PORT
                    });
                }
            } else {
                genericLog('ERROR: missing port number... ', 'red');
                genericLog(`i.e: riko r ${runCommand} <port>`, 'red');
            }

            break;
        }
        default: {
            break;
        }
    }
};