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

    funcs.sanitizeString = (str) => str.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

    funcs.getFileIfExists = (path) => {
        let file = null;

        try {
            file = require(`${path}`);
        } catch (err) {
            funcs.genericLog(`ERROR: requiring ${_v.path.basename(path)} in ${_v.path.dirname(path)} directory \n ${err}`);
            throw new Error(err);
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

    funcs.assignEnvironmentVariablesBasedOnRunCommand = (runCommand) => {
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

        process.env.ELECTRON = !_v._.isEmpty(runCommand.match(/electron\b/));

        console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
        console.log('process.env.ELECTRON:', process.env.ELECTRON);
    };

    funcs.onDevBuildActions = (customConfig) => {
        funcs.genericLog('Updating Source File Watcher executing initial tests...');

        const watcher = _v.chokidar.watch(customConfig.srcFiles, {ignored: /[\/\\]\./});

        watcher.on('change', () => {

            let spawn;

            if(!_v._.isEmpty(customConfig.hotExecuteTestCommand)) {
                spawn = funcs.executeJestTests(customConfig.packageJson, customConfig.hotExecuteTestCommand);
            }

            if(spawn || _v._.isEmpty(customConfig.hotExecuteTestCommand)) {
                spawn.on('close', funcs.executeFlowTests);
            }
        });

        const spawn = funcs.executeJestTests(customConfig.packageJson, customConfig.hotExecuteTestCommand);
        spawn.on('close', funcs.executeFlowTests);
    };

    funcs.executeJestTests = (packageJson, customTestCommand) => {
        const isValidCommand = _v._
            .chain(packageJson.scripts)
            .keys()
            .includes(customTestCommand)
            .value();

        if(isValidCommand) {
            return _v.spawn('npm', ['run', customTestCommand], {stdio: 'inherit'});
        } else {
            funcs.genericLog(`Invalid command. Make sure the hot execute test command you're trying to execute lives in your package.json
             under 'scripts'.`, 'red');
            throw new Error('Invalid npm script command. see config.hotExecuteTestCommand in rikoconfig.js file');
        }
    };

    funcs.executeFlowTests = () => {
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