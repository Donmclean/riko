import fs from 'fs-extra';
import { includes, isEmpty, forEach, eq, isNil, get } from 'lodash';
import chai from 'chai';
const assert = chai.assert;
import path from 'path';
import updateNotifier from 'update-notifier';
import { cwd, packageJson } from './variables';
import gulpLoadPlugins from 'gulp-load-plugins';

const $ = gulpLoadPlugins();

export const isValidOption = (options, targetOption) => includes(options, targetOption);

export const logOptionsError = (options, choice) => {
    genericLog(`Invalid choice: (${choice}). ${!isEmpty(options) ? 'Choose: [' + options.join(', ') + ']' : ''}`, 'red');
};

export const genericLog = (str, color) => {
    $.util.log($.util.colors[color || 'yellow'](str));
};

export const folderAlreadyPresent = (files, folderName) => includes(files, folderName);

export const sanitizeString = (str) => str.toString().replace(/[ ]*,[ ]*|[ ]+/g, ' ');

export const hasWhiteSpace = (str) => /\s/g.test(str);

export const sortObjByOwnKeys = (obj) => Object.keys(obj).sort().reduce((accObj, key) => {
    accObj[key] = obj[key];
    return accObj;
}, {});

export const getFileIfExists = (modulePath) => {
    let file = null;

    try {
        file = require(`${modulePath}`);
    } catch (err) {
        genericLog(`ERROR: requiring ${path.basename(modulePath)} in ${path.dirname(modulePath)} directory \n ${err}`, 'red');
        throw new Error(err);
    }

    return get(file, 'default', file);
};

export const validateRikoConfig = (rikoConfig, runCommand) => {
    let valid = false;

    switch (runCommand) {
        case 'electron-dev':
        case 'electron-prod':
        case 'react-dev':
        case 'react-prod': {
            assert.isTrue(!isEmpty(rikoConfig), `rikoConfig cannot be empty`);

            const rikoConfigRequiredKeys = ['setWebpackConfig', 'setCustomBoilerplatePath', 'setWebpackEventHooks', 'setElectronPackagerOptions'];

            forEach(rikoConfigRequiredKeys, key => {
                assert.isTrue(includes(Object.keys(rikoConfig), key), `${key} must be present in rikoConfig`);

                const type = 'function';
                assert.typeOf(rikoConfig[key], type, `${key} must be of type ${type}`);
            });

            valid = true;
            break;
        }
        default: {
            valid = true;
            break;
        }
    }
    genericLog('rikoconfig.js file is valid!', 'green');

    return valid;
};

export const requiresTemplate = (projectType) => eq(projectType, 'react') || eq(projectType, 'electron');

export const removeDir = (dir) => {
    genericLog(`Cleaning ${dir} directory: `);
    return fs.remove(dir);
};

export const logElectronRunServerError = () => {
    genericLog('Error: Can\'t find built Electron Package in destination folder... Either an error occurred while building or the platform option wasn\'t correctly specified.', 'red');
    genericLog('To launch your Electron app on MAC be sure include "darwin" as an option to "platform" in your rikoconfig.js "electronPackagerOptions"', 'red');
};

export const readFilesInDirectorySync = (path) => fs.readdirSync(path).filter((file) => file !== '.DS_Store');

export const regexReplaceCustomBoilerplateString = (content, fileName) => content.replace(/<:rikofilename:>/g, path.basename(fileName.split('.')[0], path.extname(fileName)));

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

export const processExitHandler = () => process.on('SIGINT', () => {
    process.stdout.write('\n');
    process.exit(0);
});

export const checkForNewPackageVersion = () => updateNotifier({pkg: packageJson}).notify({defer: true});

export const getElectronPackagerOptions = (electronPackagerOptions, webpackConfig, config) => Object.assign(
    {},

    //Default
    {
        platform: 'all',
        icon: path.resolve(__dirname, '../build-assets/riko-logo.icns')
    },

    //Custom
    electronPackagerOptions,

    //Required
    {
        dir: config.tempDir,
        overwrite: true,
        out: config.destDir //webpackConfig.output.path
    }
);

export const applyWebpackEventHooks = (webpackEventHooks, compiler) => {
    if(!isEmpty(webpackEventHooks)) {
        forEach(webpackEventHooks, (webpackEventHookCallback, webpackEventHookName) => {
            compiler.plugin(webpackEventHookName, webpackEventHookCallback);
        });
    }

    return compiler;
};