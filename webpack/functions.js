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

    functions.handleElectronEnvironmentOptions = (config, plugins) => {
        let newPlugins = [];

        //GLOBAL OPTIONS

        //change public path if building electron
        config.output.path = config.tempDir;
        config.output.publicPath = '';

        switch (_v.NODE_ENV) {
            case 'production': {
                //COPY ADDITIONAL ELECTRON FILES TO TEMP DIR
                newPlugins = plugins.concat([new _v.CopyWebpackPlugin([
                    { from: config.srcDir + '/electron.js', to: config.tempDir },
                    { from: config.srcDir + '/package.json', to: config.tempDir },
                    { from: config.electronPackagingOptions.icon, to: config.tempDir }
                ])]);
                break;
            }
            case 'test':
            case 'development': {
                //ELECTRON DEV MODE
                newPlugins = plugins.concat([new _v.WebpackShellPlugin({
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

    functions.executeJestTests = (silent = false) => {
        return _v.spawn('npm', ['run', 'test-jest-watch'], silent ? {} : {stdio: 'inherit'});
    };

    functions.runFlow = (silent = false) => {
        silent ? console.log('executing flow...') : null;
        return _v.spawnSync('flow', ['check'], silent ? {} : {stdio: 'inherit'});
    };

    return functions;

};