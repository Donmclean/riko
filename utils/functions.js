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

    funcs.hasWhiteSpace = (str) => /\s/g.test(str);

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
                        sourceMap: !!customConfig.devtool
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
                        sourceMap: !!customConfig.devtool
                    }
                } : null

            ])
        })
    });

    funcs.stylesheetDevRules = (type, regex, customConfig) => ({
        test: new RegExp(regex),
        loaders: _v._.compact([
            'style-loader',
            `css-loader${customConfig.devtool ? '?sourceMap' : ''}`,
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
            (type !== 'css') ? `${type}-loader${customConfig.devtool ? '?sourceMap' : ''}` : null
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

    funcs.requiresTemplate = (projectType) => _v._.eq(projectType, 'react') || _v._.eq(projectType, 'electron');

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
        }).catch((err) => {
            funcs.genericLog(`ERROR directory does not exist \n ${err}`, 'red');
            deferred.reject(err);
        });

        return deferred.promise;
    };

    funcs.pickPluginFromKey = (plugins, key) => _v._.chain(plugins).keys().includes(key).value();

    funcs.handleCustomAdditions = (configMap, envConfigMap, defaultRules, defaultPlugins) => {
        //extract unique default loaders by 'test' key
        const uniqDefaultRules = _v._.chain(defaultRules)
            .reject((defaultRule) => _v._.includes(_v.immutable.fromJS(envConfigMap.getIn(['module', 'rules'])
                    .map((rule) => rule.test.toString())).toJS(), defaultRule.test.toString()))
            .value();

        const mergedWithDefaultsRules = _v.merge(
            {rules: _v.immutable.fromJS(uniqDefaultRules).toJS()},
            {rules: _v.immutable.fromJS(envConfigMap.getIn(['module', 'rules'])).toJS()}
        );

        configMap.updateIn(['module','rules'], (rules) => _v.immutable.fromJS(rules).concat(_v.immutable.fromJS(mergedWithDefaultsRules.rules)));

        //extract unique default plugins by 'constructor.name'
        const uniqDefaultPlugins = _v._.reject(defaultPlugins, (defaultPlugin) => {
            return _v._.includes(
                envConfigMap.get('plugins').map(plugin => plugin.constructor.name),
                defaultPlugin.constructor.name
            );
        });

        const mergedWithDefaultPlugins  = _v.merge(
            {plugins: _v.immutable.fromJS(uniqDefaultPlugins).toJS()},
            {plugins: _v.immutable.fromJS(envConfigMap.get('plugins')).toJS()}
        );

        configMap.update('plugins', (plugins) => _v.immutable.fromJS(plugins).concat(_v.immutable.fromJS(mergedWithDefaultPlugins)).flatten(true));
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
            case JSON.parse(process.env.isReactNative): {
                return funcs.getFileIfExists('./defaultConfigs/reactNativeConfig');
            }
            case JSON.parse(process.env.isReact):
            case JSON.parse(process.env.isElectron): {
                return funcs.getFileIfExists('./defaultConfigs/reactElectronConfig');
            }
            case JSON.parse(process.env.isNodeServer): {
                return funcs.getFileIfExists('./defaultConfigs/nodeServerConfig');
            }
            default: {
                throw new Error (`can't get default from runCommand: ${runCommand}`);
            }
        }
    };

    funcs.assignEnvironmentVariablesBasedOnRunCommand = (runCommands, runCommand) => {
        //Sets run command for later access
        process.env.runCommand = runCommand;

        //assign environment variable
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

        //assign project types booleans
        process.env.isReactNative = _v._.includes(runCommands['react-native'], runCommand);
        process.env.isReact = _v._.includes(runCommands.react, runCommand);
        process.env.isElectron = _v._.includes(runCommands.electron, runCommand);
        process.env.isNodeServer = _v._.includes(runCommands['node-server'], runCommand);

        funcs.genericLog(`Environment (process.env.NODE_ENV): ${process.env.NODE_ENV}`, 'blue');
    };

    funcs.doRunCommandValidations = () => {
        const baseDirName = _v.path.basename(_v.cwd);
        const hasWhiteSpace = funcs.hasWhiteSpace(baseDirName);

        if(hasWhiteSpace) {
            funcs.genericLog(`Base directory (${baseDirName}) cannot have whitespaces.`, 'red');
            throw new Error(`Base directory cannot have whitespaces.`);
        }
    };

    funcs.handleTestExecution = (customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand) => {
        let spawn;

        if(hasHotExecTestCommand) {
            spawn = funcs.hotExecuteTests(customConfig);
        } else if(hasHotExecFlowTypeCommand) {
            funcs.hotExecuteFlowTests(customConfig);
        }

        if(spawn && hasHotExecFlowTypeCommand) {
            spawn.on('close', () => funcs.hotExecuteFlowTests(customConfig));
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

    funcs.hotExecuteTests = (customConfig) => {
        const hotReloadingOptions = customConfig.hotReloadingOptions || {};
        const customTestCommand = hotReloadingOptions.hotExecuteTestCommand;
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

    funcs.hotExecuteFlowTests = (customConfig) => {
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