const _v = require('./variables')();

module.exports = () => {
    const funcs = {};

    funcs.isValidOption = (options, targetOption) => _v._.includes(options, targetOption);

    funcs.logOptionsError = (options, choice) => {
        funcs.genericLog(`Invalid choice: (${choice}). ${!_v._.isEmpty(options) ? 'Choose: [' + options.join(', ') + ']' : ''}`, 'red');
    };

    funcs.genericLog = (str, color) => {
        const { $ } = _v;
        $.util.log($.util.colors[color || 'yellow'](str));
    };

    funcs.folderAlreadyPresent = (files, folderName) => _v._.includes(files, folderName);

    funcs.sanitizePath = (base, path) => {
        let resolvedPath;

        try {
            resolvedPath = _v.path.resolve(base, path);
        } catch (err) {
            funcs.genericLog(`${base}/${path} cannot be resolved`, 'red');
            throw new Error(`cannot find ${path} to resolve`);
        }

        return resolvedPath;
    };

    funcs.removeLeadingAndTrailingSlashesFromString = (str) => typeof str === 'string' ? str.replace(/^\/|\/$/g, '') : '';

    funcs.sanitizeString = (str) => str.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

    funcs.sortObjByOwnKeys = (obj) => Object.keys(obj).sort().reduce((accObj, key) => {
        accObj[key] = obj[key];
        return accObj;
    }, {});

    funcs.getFileIfExists = (path) => {
        let file = null;

        try {
            file = require(`${path}`);
        } catch (err) {
            funcs.genericLog(`ERROR: requiring ${_v.path.basename(path)} in ${_v.path.dirname(path)} directory \n ${err}`, 'red');
            throw new Error(err);
        }

        return file;
    };

    funcs.stylesheetProdRules = (type, regex, customConfig, ExtractTextPlugin) => ({
        test: new RegExp(regex),
        use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: _v._.compact([
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: customConfig.sourcemapProd
                    }
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => {
                            return [
                                _v.autoprefixer(customConfig.autoprefixerOptions)
                            ];
                        }
                    }
                },
                (type !== 'css') ? {
                    loader: `${type}-loader`,
                    options: {
                        sourceMap: customConfig.sourcemapProd
                    }
                } : null

            ])
        })
    });

    funcs.stylesheetDevRules = (type, regex, customConfig) => ({
        test: new RegExp(regex),
        loaders: _v._.compact([
            'style-loader',
            `css-loader${customConfig.sourcemapDev ? '?sourceMap' : ''}`,
            {
                loader: 'postcss-loader',
                options: {
                    plugins: () => {
                        return [
                            _v.autoprefixer(customConfig.autoprefixerOptions)
                        ];
                    }
                }
            },
            (type !== 'css') ? `${type}-loader${customConfig.sourcemapDev ? '?sourceMap' : ''}` : null
        ])
    });

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

    funcs.requiresTemplate = (projectType) => _v._.eq(projectType, 'web') || _v._.eq(projectType, 'electron');

    funcs.removeDir = (dir) => {
        const deferred = _v.Q.defer();

        _v.qfs.isDirectory(dir).then((exists) => {
            if(exists) {
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
            } else {
                funcs.genericLog(`${dir} directory does not exist...`, 'red');
                deferred.resolve();
            }
        });

        return deferred.promise;
    };

    funcs.pickPluginFromKey = (plugins, key) => _v._.chain(plugins).keys().includes(key).value();

    funcs.handleCustomAdditions = (env, configMap, defaultLoaders, defaultPlugins) => {
        // Concat With Default Rules/Loaders
        configMap.updateIn(['module', 'rules'], (loaders) => _v.immutable.fromJS(loaders).concat(_v.immutable.fromJS(defaultLoaders)));

        // Concat With Default Plugins
        configMap.update('plugins', (plugins) => _v.immutable.fromJS(plugins).concat(_v.immutable.fromJS(defaultPlugins)).flatten(true));

        configMap.mergeDeep(configMap.map((values) => _v.immutable.fromJS(values)));
    };

    funcs.logElectronRunServerError = () => {
        funcs.genericLog('Error: Can\'t find built Electron Package in destination folder... Either an error occurred while building or the platform option wasn\'t correctly specified.', 'red');
        funcs.genericLog('To launch your Electron app on MAC be sure include "darwin" as an option to "platform" in your rikoconfig.js "electronPackagerOptions"', 'red');
    };

    funcs.readFilesInDirectorySync = (path) => _v.fs.readdirSync(path).filter((file) => file !== '.DS_Store');

    funcs.regexReplaceCustomBoilerplateString = (content, fileName) => content.replace(/<:rikofilename:>/g, _v.path.basename(fileName.split('.')[0], _v.path.extname(fileName)));

    funcs.readReplaceAndWriteFilesToNewDirAsync = (fileName, sourceFilePath, newFilePath) => {
        return _v.qfs.read(sourceFilePath)
            .then((content) => {
                const editedContent = funcs.regexReplaceCustomBoilerplateString(content, fileName);
                const editedFilePath = funcs.regexReplaceCustomBoilerplateString(newFilePath, fileName);
                funcs.genericLog(`Creating ${editedFilePath}`);
                return _v.qfs.write(editedFilePath, editedContent);
            })
    };

    funcs.getDefaultConfigFromRunCommand = (runCommand) => {
        if(_v._.isNil(runCommand)) {
            throw new Error (`runCommand is ${runCommand}`);
        }

        switch (true) {
            case !_v._.isEmpty(runCommand.match(/electron\b/i)):
            case !_v._.isEmpty(runCommand.match(/web\b/i)): {
                return funcs.getFileIfExists('./defaultConfigs/webElectronConfig');
            }
            default: {
                throw new Error (`can't get default from runCommand: ${runCommand}`);
            }
        }
    };

    funcs.assignEnvironmentVariablesBasedOnRunCommand = (runCommand) => {
        //Sets run command for later access
        process.env.runCommand = runCommand;

        switch (true) {
            case !_v._.isEmpty(runCommand.match(/-dev\b/)): {
                process.env.NODE_ENV = 'development';
                break;
            }
            case !_v._.isEmpty(runCommand.match(/-prod\b/)): {
                process.env.NODE_ENV = 'production';
                break;
            }
            case !_v._.isEmpty(runCommand.match(/-test\b/)): {
                process.env.NODE_ENV = 'test';
                break;
            }
            default: {
                break;
            }
        }

        process.env.isWeb = !_v._.isEmpty(runCommand.match(/(web)\b/i));
        process.env.isElectron = !_v._.isEmpty(runCommand.match(/(electron)\b/i));

        funcs.genericLog(`Environment (process.env.NODE_ENV): ${process.env.NODE_ENV}`, 'blue');
    };

    funcs.handleTestExecution = (customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand) => {
        let spawn;

        if(hasHotExecTestCommand) {
            spawn = funcs.executeJestTests(customConfig);
        } else if(hasHotExecFlowTypeCommand) {
            funcs.executeFlowTests(customConfig);
        }

        if(spawn && hasHotExecFlowTypeCommand) {
            spawn.on('close', () => funcs.executeFlowTests(customConfig));
        }
    };

    funcs.onDevBuildActions = (customConfig) => {
        funcs.genericLog('Updating Source File Watcher executing initial tests...');

        const watcher = _v.chokidar.watch(customConfig.srcFiles, {ignored: /[\/\\]\./});
        const hasHotExecTestCommand = !_v._.isEmpty(customConfig.hotReloadingOptions.hotExecuteTestCommand);
        const hasHotExecFlowTypeCommand = !_v._.isEmpty(customConfig.hotReloadingOptions.hotExecuteFlowTypeCommand);

        watcher.on('change', () => {
            funcs.handleTestExecution(customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand);
        });

        funcs.handleTestExecution(customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand);
    };

    funcs.isValidPackageJsonScript = (packageJson, customTestCommand) => _v._
        .chain(packageJson.scripts)
        .keys()
        .includes(customTestCommand)
        .value();

    funcs.executeJestTests = (customConfig) => {
        const customTestCommand = customConfig.hotReloadingOptions.hotExecuteTestCommand;
        const isValidCommand = funcs.isValidPackageJsonScript(customConfig.packageJson, customTestCommand);

        if(isValidCommand) {
            const env = Object.create( process.env );
            env.NODE_ENV = 'test';

            funcs.genericLog('Executing Tests...');
            return _v.spawn('npm', ['run', customTestCommand], {stdio: 'inherit', env});
        } else {
            funcs.genericLog(`Invalid command. Make sure the hot execute test command you're trying to execute lives in your package.json
             under 'scripts'.`, 'red');
            throw new Error('Invalid npm script command. see config.hotReloadingOptions.hotExecuteTestCommand in rikoconfig.js file');
        }
    };

    funcs.processExitHandler = () => process.on('SIGINT', () => {
        process.stdout.write('\n');
        process.exit(0);
    });

    funcs.executeFlowTests = (customConfig) => {
        const { qfs, cwd, _ } = _v;

        const customTestCommand = customConfig.hotReloadingOptions.hotExecuteFlowTypeCommand;
        const isValidCommand = funcs.isValidPackageJsonScript(customConfig.packageJson, customTestCommand);
        const isDefaultFlowTypeHotExecCommand = (customTestCommand === 'default');

        if(isValidCommand || isDefaultFlowTypeHotExecCommand) {
            funcs.genericLog('Executing Flow...');

            return qfs.list(cwd).then((files) => {
                if(_.includes(files, '.flowconfig')) {
                    const env = Object.create( process.env );
                    env.NODE_ENV = 'test';

                    if(isDefaultFlowTypeHotExecCommand) {
                        return _v.spawnSync(`${_v.baseDir}/node_modules/.bin/flow`, ['check'], {stdio: 'inherit', env});
                    } else {
                        return _v.spawn('npm', ['run', customTestCommand], {stdio: 'inherit', env});
                    }

                } else {
                    funcs.genericLog('no .flowconfig found', 'red');
                    return false;
                }
            });
        } else {
            funcs.genericLog(`Invalid command. Make sure the hot execute flowtype command you're trying to execute lives in your package.json
             under 'scripts'.`, 'red');
            throw new Error('Invalid npm script command. see config.hotReloadingOptions.hotExecuteFlowTypeCommand in rikoconfig.js file');
        }
    };

    return funcs;
};