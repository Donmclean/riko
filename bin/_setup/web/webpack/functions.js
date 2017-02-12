"use strict";
module.exports = (_v) => {
    const functions = {};

    functions.insertGitSHAIntoFilename = (filename, GitVersion) => {
        if(filename && !_v._.isEmpty(filename)) {
            let arr = filename.split('.');
            arr[0] = arr[0].concat('-');
            arr[1] = '.'.concat(arr[1]);

            arr.splice(1, 0, GitVersion);
            return arr.join('');
        }

        return GitVersion + '.html';
    };

    functions.webpackCompilationErrorHandler = (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.error(info.errors);
        }

        if (stats.hasWarnings()) {
            console.warn(info.warnings)
        }
    };

    functions.launchVorlonJS = () => {
        _v.exec('npm run vorlon', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error > enableRemoteDebugging: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    };

    functions.getStats = (NODE_ENV) => ({
        colors: true, hash: true, version: true, timings: true, assets: NODE_ENV === 'production',
        chunks: false, modules: false, reasons: false, children: false, source: false,
        errors: true, errorDetails: true, warnings: true, publicPath: false
    });

    functions.testRequiredFields = (assert, requiredConfigKeys, configKeys, configName) => {
        _v._.forEach(requiredConfigKeys, key => {
            assert.isTrue(_v._.includes(configKeys, key), `${key} needs to be present in ${configName}`);
        });
    };

    functions.testRequiredTypes = (assert, config, mockConfig) => {
        _v._.forEach(config, (value, key) => {
            let type = _v._.find(mockConfig, (mock_value, mock_key) => key === mock_key);
            assert.typeOf(value, type, `${key} needs to be of type ${type}`);
        });
    };

    functions.removeDir = (dir) => {
        const deferred = _v.Q.defer();

        _v.qfs.isDirectory(dir).then((exists) => {
            if(exists) {
                try {
                    console.log(`Cleaning ${dir} directory: `);
                    _v.qfs.removeTree(dir)
                        .then(() => {
                            console.log(`${dir} directory removed...`);
                            deferred.resolve();
                        })
                        .catch((err) => {
                            console.log(`ERROR removing ${dir}`, err);
                            deferred.reject(err);
                        });
                } catch (err) {
                    console.log(`ERROR removing ${dir}`, err);
                    deferred.reject(err);
                }
            } else {
                console.log(`${dir} directory does not exist...`);
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    functions.handleElectronEnvironmentOptions = (config, customConfig) => {
        let newPlugins = [];

        //GLOBAL OPTIONS

        //change public path if building electron
        config.output.path = customConfig.tempDir;
        config.output.publicPath = '';

        switch (_v.NODE_ENV) {
            case 'production': {
                //COPY ADDITIONAL ELECTRON FILES TO TEMP DIR
                newPlugins = config.plugins.concat([new _v.CopyWebpackPlugin([
                    { from: customConfig.srcDir + '/electron.js', to: customConfig.tempDir },
                    { from: customConfig.srcDir + '/package.json', to: customConfig.tempDir },
                    { from: customConfig.electronPackagingOptions.icon, to: customConfig.tempDir }
                ])]);
                break;
            }
            case 'test':
            case 'development': {
                //ELECTRON DEV MODE
                newPlugins = config.plugins.concat([new _v.WebpackShellPlugin({
                    onBuildEnd: ['npm run electron-dev']
                })]);
                break;
            }
            default: {
                break;
            }
        }

        return newPlugins;
    };

    functions.onDevBuildActions = (customConfig) => {
        console.log('Updating Source File Watcher executing initial tests...');

        const watcher = _v.chokidar.watch(customConfig.srcFiles, {ignored: /[\/\\]\./});

        watcher.on('change', () => {
            const spawn = customConfig.hotExecuteTests ? functions.executeJestTests() : null;

            if(spawn) {
                spawn.on('close', functions.runFlow);
            }
        });

        const spawn = functions.executeJestTests();
        spawn.on('close', functions.runFlow);
    };

    functions.executeJestTests = (silent = false) => {
        return _v.spawn('npm', ['run', 'test-jest-watch'], silent ? {} : {stdio: 'inherit'});
    };

    functions.runFlow = (silent = false) => {
        silent ? console.log('executing flow...') : null;
        return _v.spawnSync('flow', ['check'], silent ? {} : {stdio: 'inherit'});
    };

    return functions;

};