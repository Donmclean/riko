const _v = require('./variables')();

module.exports = () => {
    const funcs = {};

    funcs.isValidOption = (options, targetOption) => _v._.includes(options, targetOption);

    funcs.throwOptionsError = (options, choice) => {
        throw new Error(`Invalid choice: (${choice}). Choices: ${options.join(', ')}`);
    };

    funcs.genericLog = (str, color) => {
        const { $ } = _v;
        $.util.log($.util.colors[color || 'yellow'](str));
    };

    funcs.folderAlreadyPresent = (files, folderName) => _v._.includes(files, folderName);

    funcs.sanitizeProjectName = (projectName) => projectName.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

    funcs.verifyFileExists = (path) => {
        let file = null;

        try {
            file = require(`${path}`);
        } catch (err) {
            funcs.genericLog(`ERROR: no ${_v.path.basename(path)} file found in src/ directory`);
            throw new Error(`ERROR: no ${_v.path.basename(path)} file found in src/ directory`, err);
        }

        return file;
    };

    funcs.insertGitSHAIntoFilename = (filename, GitVersion) => {
        if(filename && !_v._.isEmpty(filename)) {
            let arr = filename.split('.');
            arr[0] = arr[0].concat('-');
            arr[1] = '.'.concat(arr[1]);

            arr.splice(1, 0, GitVersion);
            return arr.join('');
        }

        return GitVersion + '.html';
    };

    funcs.launchVorlonJS = () => {
        _v.exec('npm run vorlon', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error > enableRemoteDebugging: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    };

    funcs.getStats = (NODE_ENV) => ({
        colors: true, hash: true, version: true, timings: true, assets: NODE_ENV === 'production',
        chunks: false, modules: false, reasons: false, children: false, source: false,
        errors: true, errorDetails: true, warnings: true, publicPath: false
    });

    funcs.testRequiredFields = (assert, requiredConfigKeys, configKeys, configName) => {
        _v._.forEach(requiredConfigKeys, key => {
            assert.isTrue(_v._.includes(configKeys, key), `${key} needs to be present in ${configName}`);
        });
    };

    funcs.testRequiredTypes = (assert, config, mockConfig) => {
        _v._.forEach(config, (value, key) => {
            let type = _v._.find(mockConfig, (mock_value, mock_key) => key === mock_key);
            assert.typeOf(value, type, `${key} needs to be of type ${type}`);
        });
    };

    funcs.removeDir = (dir) => {
        const deferred = _v.Q.defer();

        _v.qfs.isDirectory(dir).then((exists) => {
            if(exists) {
                try {
                    funcs.genericLog(`Cleaning ${dir} directory: `);
                    _v.qfs.removeTree(dir)
                        .then(() => {
                            funcs.genericLog(`${dir} directory removed...`);
                            deferred.resolve();
                        })
                        .catch((err) => {
                            funcs.genericLog(`ERROR removing ${dir}\n ${err}`, 'red');
                            deferred.reject(err);
                        });
                } catch (err) {
                    funcs.genericLog(`ERROR removing ${dir}\n ${err}`, 'red');
                    deferred.reject(err);
                }
            } else {
                funcs.genericLog(`${dir} directory does not exist...`, 'red');
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    funcs.handleElectronEnvironmentOptions = (config, customConfig) => {
        let newPlugins = [];

        //GLOBAL OPTIONS

        //change public path if building electron
        config.output.path = customConfig.tempDir;
        config.output.publicPath = '';

        switch (process.env.NODE_ENV) {
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
                console.log('${_v.cwd}: ', `${_v.cwd}`);
                console.log('${_v.baseDir}: ', `${_v.baseDir}`);
                newPlugins = config.plugins.concat([new _v.WebpackShellPlugin({
                    onBuildEnd: [`${_v.baseDir}/node_modules/.bin/electron -r babel-register ${_v.cwd}/src/electron.js`]
                })]);
                break;
            }
            default: {
                break;
            }
        }

        return newPlugins;
    };

    funcs.logElectronRunServerError = () => {
        funcs.genericLog('Error: Can\'t find built Electron Package in destination folder... Either an error occurred while building or the platform option wasn\'t correctly specified.', 'red');
        funcs.genericLog('To launch your Electron app on MAC be sure include "darwin" as an option to "platform" in your rikoconfig.js "electronPackagingOptions"', 'red');
    };

    funcs.onDevBuildActions = (customConfig) => {
        funcs.genericLog('Updating Source File Watcher executing initial tests...');

        const watcher = _v.chokidar.watch(customConfig.srcFiles, {ignored: /[\/\\]\./});

        watcher.on('change', () => {
            const spawn = customConfig.hotExecuteTests ? funcs.executeJestTests() : null;

            if(spawn) {
                spawn.on('close', funcs.runFlow);
            }
        });

        const spawn = funcs.executeJestTests();
        spawn.on('close', funcs.runFlow);
    };

    funcs.executeJestTests = (silent = false) => {
        const customJestConfig = funcs.verifyFileExists(`${_v.cwd}/jestconfig.js`);

        const defaultJestConfig = {
            "rootDir": `${_v.baseDir}`,
            "transform": {
                ".*": `${_v.baseDir}/node_modules/babel-jest`
            }
        };

        const jestconfig = Object.assign({}, customJestConfig, defaultJestConfig);

        return _v.spawn(
            `${_v.baseDir}/node_modules/.bin/jest`, ['-o', '--config', `${JSON.stringify(jestconfig)}`], silent ? {} : {stdio: 'inherit'}
        );
    };

    funcs.runFlow = () => {
        const { qfs, cwd, _ } = _v;

        funcs.genericLog('executing flow...');

        return qfs.list(cwd).then((files) => {
            if(_.includes(files, '.flowconfig')) {
                return _v.spawnSync(`${_v.baseDir}/node_modules/.bin/flow`, ['check'], {stdio: 'inherit'});
            } else {
                funcs.genericLog('no .flowconfig found', 'red');
                return false;
            }
        });
    };

    return funcs;
};