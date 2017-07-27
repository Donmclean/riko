import fs from 'fs';
import { packageJson } from '../utils/variables';
import { includes, isEmpty, compact, forEach, find, eq, chain, reject, isNil, get, isEqual } from 'lodash';
import immutable from 'immutable';
import webpack from 'webpack';
import chokidar from 'chokidar';
import Q from 'q';
import qfs from 'q-io/fs';
import merge from 'webpack-merge';
import path from 'path';
import autoprefixer from 'autoprefixer';
import { cwd, baseDir } from '../utils/variables';
import spawn from 'cross-spawn';
import GitHubApi from 'github';
import gulpLoadPlugins from 'gulp-load-plugins';

const spawnSync = spawn.sync;
const $ = gulpLoadPlugins();

const github = new GitHubApi({ followRedirects: false, timeout: 5000 });

export const isValidOption = (options, targetOption) => includes(options, targetOption);

export const logOptionsError = (options, choice) => {
    genericLog(`Invalid choice: (${choice}). ${!isEmpty(options) ? 'Choose: [' + options.join(', ') + ']' : ''}`, 'red');
};

export const genericLog = (str, color) => {
    $.util.log($.util.colors[color || 'yellow'](str));
};

export const folderAlreadyPresent = (files, folderName) => includes(files, folderName);

export const sanitizePath = (base, path) => {
    let resolvedPath;

    try {
        resolvedPath = path.resolve(base, path);
    } catch (err) {
        genericLog(`${base}/${path} cannot be resolved`, 'red');
        throw new Error(`cannot find ${path} to resolve`);
    }

    return resolvedPath;
};

export const removeLeadingAndTrailingSlashesFromString = (str) => typeof str === 'string' ? str.replace(/^\/|\/$/g, '') : '';

export const sanitizeString = (str) => str.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

export const hasWhiteSpace = (str) => /\s/g.test(str);

export const sortObjByOwnKeys = (obj) => Object.keys(obj).sort().reduce((accObj, key) => {
    accObj[key] = obj[key];
    return accObj;
}, {});

export const getFileIfExists = (path) => {
    let file = null;

    try {
        file = require(`${path}`);
    } catch (err) {
        genericLog(`ERROR: requiring ${path.basename(path)} in ${path.dirname(path)} directory \n ${err}`, 'red');
        throw new Error(err);
    }

    return get(file, 'default', file);
};

export const stylesheetProdRules = (type, regex, customConfig, ExtractTextPlugin) => ({
    test: new RegExp(regex),
    use: ExtractTextPlugin.extract({
        fallback: "style-loader",
        use: compact([
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
                            autoprefixer(customConfig.autoprefixerOptions)
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

export const stylesheetDevRules = (type, regex, customConfig) => ({
    test: new RegExp(regex),
    loaders: compact([
        'style-loader',
        `css-loader${customConfig.devtool ? '?sourceMap' : ''}`,
        {
            loader: 'postcss-loader',
            options: {
                plugins: () => {
                    return [
                        autoprefixer(customConfig.autoprefixerOptions)
                    ];
                }
            }
        },
        (type !== 'css') ? `${type}-loader${customConfig.devtool ? '?sourceMap' : ''}` : null
    ])
});

export const getStats = (NODE_ENV) => ({
    colors: true, hash: true, version: true, timings: true, assets: NODE_ENV === 'production',
    chunks: false, modules: false, reasons: false, children: false, source: false,
    errors: true, errorDetails: true, warnings: true, publicPath: false
});

export const testRequiredFields = (assert, requiredConfigKeys, configKeys, configName) => {
    forEach(requiredConfigKeys, key => {
        assert.isTrue(includes(configKeys, key), `${key} needs to be present in ${configName}`);
    });
};

export const testRequiredTypes = (assert, config, mockConfig) => {
    forEach(config, (value, key) => {
        let type = find(mockConfig, (mock_value, mock_key) => key === mock_key);
        assert.typeOf(value, type, `${key} needs to be of type ${type}`);
    });
};

export const requiresTemplate = (projectType) => eq(projectType, 'react') || eq(projectType, 'electron');

export const removeDir = (dir) => {
    const deferred = Q.defer();

    qfs.isDirectory(dir).then((exists) => {
        if(exists) {
            genericLog(`Cleaning ${dir} directory: `);
            qfs.removeTree(dir)
                .then(() => {
                    genericLog(`${dir} directory removed...`);
                    deferred.resolve();
                })
                .catch((err) => {
                    genericLog(`ERROR removing ${dir}\n ${err}`, 'red');
                    deferred.reject(err);
                });
        } else {
            genericLog(`${dir} directory does not exist...`, 'red');
            deferred.resolve();
        }
    }).catch((err) => {
        genericLog(`ERROR directory does not exist \n ${err}`, 'red');
        deferred.reject(err);
    });

    return deferred.promise;
};

export const pickPluginFromKey = (plugins, key) => chain(plugins).keys().includes(key).value();

export const handleCustomAdditions = (configMap, envConfigMap, defaultRules, defaultPlugins) => {
    //extract unique default loaders by 'test' key
    const uniqDefaultRules = chain(defaultRules)
        .reject((defaultRule) => includes(immutable.fromJS(envConfigMap.getIn(['module', 'rules'])
            .map((rule) => rule.test.toString())).toJS(), defaultRule.test.toString()))
        .value();

    const mergedWithDefaultsRules = merge(
        {rules: immutable.fromJS(uniqDefaultRules).toJS()},
        {rules: immutable.fromJS(envConfigMap.getIn(['module', 'rules'])).toJS()}
    );

    configMap.updateIn(['module','rules'], (rules) => immutable.fromJS(rules).concat(immutable.fromJS(mergedWithDefaultsRules.rules)));

    //extract unique default plugins by 'constructor.name'
    const uniqDefaultPlugins = reject(defaultPlugins, (defaultPlugin) => {
        return includes(
            envConfigMap.get('plugins').map(plugin => plugin.constructor.name),
            defaultPlugin.constructor.name
        );
    });

    const mergedWithDefaultPlugins  = merge(
        {plugins: immutable.fromJS(uniqDefaultPlugins).toJS()},
        {plugins: immutable.fromJS(envConfigMap.get('plugins')).toJS()}
    );

    configMap.update('plugins', (plugins) => immutable.fromJS(plugins).concat(immutable.fromJS(mergedWithDefaultPlugins)).flatten(true));
};

export const logElectronRunServerError = () => {
    genericLog('Error: Can\'t find built Electron Package in destination folder... Either an error occurred while building or the platform option wasn\'t correctly specified.', 'red');
    genericLog('To launch your Electron app on MAC be sure include "darwin" as an option to "platform" in your rikoconfig.js "electronPackagerOptions"', 'red');
};

export const readFilesInDirectorySync = (path) => fs.readdirSync(path).filter((file) => file !== '.DS_Store');

export const regexReplaceCustomBoilerplateString = (content, fileName) => content.replace(/<:rikofilename:>/g, path.basename(fileName.split('.')[0], path.extname(fileName)));

export const readReplaceAndWriteFilesToNewDirAsync = (fileName, sourceFilePath, newFilePath) => {
    return qfs.read(sourceFilePath)
        .then((content) => {
            const editedContent = regexReplaceCustomBoilerplateString(content, fileName);
            const editedFilePath = regexReplaceCustomBoilerplateString(newFilePath, fileName);
            genericLog(`Creating ${editedFilePath}`);
            return qfs.write(editedFilePath, editedContent);
        })
};

export const getDefaultConfigFromRunCommand = (runCommand) => {
    if(isNil(runCommand)) {
        throw new Error (`runCommand is ${runCommand}`);
    }

    switch (true) {
        case JSON.parse(process.env.isReactNative): {
            return getFileIfExists('./defaultConfigs/reactNativeConfig');
        }
        case JSON.parse(process.env.isReact):
        case JSON.parse(process.env.isElectron): {
            return getFileIfExists('./defaultConfigs/reactElectronConfig');
        }
        case JSON.parse(process.env.isNodeServer): {
            return getFileIfExists('./defaultConfigs/nodeServerConfig');
        }
        default: {
            throw new Error (`can't get default from runCommand: ${runCommand}`);
        }
    }
};

export const assignEnvironmentVariablesBasedOnRunCommand = (runCommands, runCommand) => {
    //Sets run command for later access
    process.env.runCommand = runCommand;

    //assign environment variable
    switch (true) {
        case !isEmpty(runCommand.match(/-dev\b/)): {
            process.env.NODE_ENV = 'development';
            break;
        }
        case !isEmpty(runCommand.match(/-prod\b/)): {
            process.env.NODE_ENV = 'production';
            break;
        }
        case !isEmpty(runCommand.match(/-test\b/)): {
            process.env.NODE_ENV = 'test';
            break;
        }
        default: {
            break;
        }
    }

    //assign project types booleans
    process.env.isReactNative = includes(runCommands['react-native'], runCommand);
    process.env.isReact = includes(runCommands.react, runCommand);
    process.env.isElectron = includes(runCommands.electron, runCommand);
    process.env.isNodeServer = includes(runCommands['node-server'], runCommand);

    genericLog(`Environment (process.env.NODE_ENV): ${process.env.NODE_ENV}`, 'blue');
};

export const doRunCommandValidations = () => {
    const baseDirName = path.basename(cwd);
    const strHasWhiteSpace = hasWhiteSpace(baseDirName);

    if(strHasWhiteSpace) {
        genericLog(`Base directory (${baseDirName}) cannot have whitespaces.`, 'red');
        throw new Error(`Base directory cannot have whitespaces.`);
    }
};

export const handleTestExecution = (customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand) => {
    let spawn;

    if(hasHotExecTestCommand) {
        spawn = hotExecuteTests(customConfig);
    } else if(hasHotExecFlowTypeCommand) {
        hotExecuteFlowTests(customConfig);
    }

    if(spawn && hasHotExecFlowTypeCommand) {
        spawn.on('close', () => hotExecuteFlowTests(customConfig));
    }
};

export const onDevBuildActions = (customConfig) => {
    genericLog('Updating Source File Watcher executing initial tests...');

    const watcher = chokidar.watch(customConfig.srcFiles, {ignored: /[\/\\]\./});
    const hasHotExecTestCommand = !isEmpty(customConfig.hotReloadingOptions.hotExecuteTestCommand);
    const hasHotExecFlowTypeCommand = !isEmpty(customConfig.hotReloadingOptions.hotExecuteFlowTypeCommand);

    watcher.on('change', () => {
        handleTestExecution(customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand);
    });

    handleTestExecution(customConfig, hasHotExecTestCommand, hasHotExecFlowTypeCommand);
};

export const isValidPackageJsonScript = (packageJson, customTestCommand) => chain(packageJson.scripts)
    .keys()
    .includes(customTestCommand)
    .value();

export const hotExecuteTests = (customConfig) => {
    const hotReloadingOptions = customConfig.hotReloadingOptions || {};
    const customTestCommand = hotReloadingOptions.hotExecuteTestCommand;
    const isValidCommand = isValidPackageJsonScript(customConfig.packageJson, customTestCommand);

    if(isValidCommand) {
        const env = Object.create( process.env );
        env.NODE_ENV = 'test';

        genericLog('Executing Tests...');
        return spawn('npm', ['run', customTestCommand], {stdio: 'inherit', env});
    } else {
        genericLog(`Invalid command. Make sure the hot execute test command you're trying to execute lives in your package.json
             under 'scripts'.`, 'red');
        throw new Error('Invalid npm script command. see config.hotReloadingOptions.hotExecuteTestCommand in rikoconfig.js file');
    }
};

export const processExitHandler = () => process.on('SIGINT', () => {
    process.stdout.write('\n');
    process.exit(0);
});

export const logUpdateAvailableMessage = (currentRikoVersion, latestRikoVersion) => {
    console.log('\n');
    genericLog(`Update available ${currentRikoVersion} => ${latestRikoVersion}`, 'cyan');
    genericLog(`npm i -g riko`, 'cyan');
    console.log('\n');
};

export const checkForNewVersionAndSetValuesGlobally = () => {
    github.repos.getLatestRelease({ owner: 'Donmclean', repo: 'riko' }, (err, res) => {
        if(!err) {
            const latestRikoVersion = get(res, 'data.name', false);
            const currentRikoVersion = `v${packageJson.version}`;

            global.latestRikoVersion = latestRikoVersion;
            global.currentRikoVersion = currentRikoVersion;
        }
    });
};

export const processBeforeExitHandler = () => process.on('beforeExit', (code) => {
    if(!isEqual(global.latestRikoVersion, global.currentRikoVersion)) {
        logUpdateAvailableMessage(global.latestRikoVersion, global.currentRikoVersion);
    }
    process.exit(code);
});

export const hotExecuteFlowTests = (customConfig) => {

    const customTestCommand = customConfig.hotReloadingOptions.hotExecuteFlowTypeCommand;
    const isValidCommand = isValidPackageJsonScript(customConfig.packageJson, customTestCommand);
    const isDefaultFlowTypeHotExecCommand = (customTestCommand === 'default');

    if(isValidCommand || isDefaultFlowTypeHotExecCommand) {
        genericLog('Executing Flow...');

        return qfs.list(cwd).then((files) => {
            if(includes(files, '.flowconfig')) {
                const env = Object.create( process.env );
                env.NODE_ENV = 'test';

                if(isDefaultFlowTypeHotExecCommand) {
                    return spawnSync(`${baseDir}/node_modules/.bin/flow`, ['check'], {stdio: 'inherit', env});
                } else {
                    return spawn('npm', ['run', customTestCommand], {stdio: 'inherit', env});
                }

            } else {
                genericLog('no .flowconfig found', 'red');
                return false;
            }
        });
    } else {
        genericLog(`Invalid command. Make sure the hot execute flowtype command you're trying to execute lives in your package.json
             under 'scripts'.`, 'red');
        throw new Error('Invalid npm script command. see config.hotReloadingOptions.hotExecuteFlowTypeCommand in rikoconfig.js file');
    }
};

export const setCustomConfigOptions = (customConfig, env) => {
    return new immutable.Map().withMutations((customOptionsMap) => {
        customOptionsMap.setIn(['module', 'rules'], immutable.fromJS([]));
        customOptionsMap.set('plugins', immutable.fromJS([]));
        customConfig.setWebpackConfigOptions(env, customOptionsMap, webpack, immutable);
    });
};