"use strict";
const
    _ = require('lodash'),
    chai = require('chai'),
    custom_config = require('../webpack.config'),
    mock_config = require('./mock-config')();

const assert = chai.assert;

const
    REQUIRED_KEYS       = _.keys(mock_config.config),
    configKeys          = _.keys(custom_config),

    VARIABLES           = custom_config.vars,
    mockConfig          = mock_config.config,
    mockdevDependencies = mock_config.packageJson.devDependencies;

describe('Config', function() {
    describe('REQUIRED_KEYS', function() {
        it('should exist and be truthy', function() {
            _.forEach(REQUIRED_KEYS, key => {
               assert.isTrue(_.includes(configKeys, key), `${key} needs to be present in config`);
            });
        });
        it('should be of valid types', function() {
            _.forEach(custom_config, (value, key) => {
                let type = _.find(mockConfig, (mock_value, mock_key) => key === mock_key);
                assert.typeOf(value, type, `${key} needs to be of type ${type}`);
            });
        });
    });

    describe('VARIABLES', function() {
        it('should exist and be truthy', function() {
            _.forEach(VARIABLES, variable => {
                assert.isOk(variable, `${variable} needs to be defined`);
            });
        });
    });

    describe('package.json', function() {
        const packageJson = require(custom_config.packageJson);

        it('should exist and be truthy', function() {
            assert.isOk(packageJson);
        });
        it('mocha should exist and be truthy', function() {
            assert.isOk(packageJson.devDependencies.mocha);
        });
        it('chai should exist and be truthy', function() {
            assert.isOk(packageJson.devDependencies.chai);
        });
        it('jest should exist and be truthy', function() {
            assert.isOk(packageJson.devDependencies.jest);
            assert.isOk(packageJson.devDependencies['jest-cli']);
        });
        it('should have required devDependencies', function () {
            _.forEach(mockdevDependencies, (val, dep) => {
                assert.isTrue(_.includes(_.keys(packageJson.devDependencies), dep), `${dep} needs to be present in package.json`);
            });
        });
    });

    describe('functions', function() {
        const functions = require('../webpack/functions')(custom_config.vars);

        it('should exist, be truthy, be an object and be have values', function() {
            assert.isOk(functions);
            assert.isObject(functions);
            assert.isNotTrue(_.isEmpty(functions), 'should not be empty');
        });

        it('insertGitSHAIntoFilename should exist and a be a function', function() {
            assert.isFunction(functions.insertGitSHAIntoFilename);
        });

        it('insertGitSHAIntoFilename should return a string', function() {
            assert.isString(functions.insertGitSHAIntoFilename('', 'GitVersion'));
            assert.isString(functions.insertGitSHAIntoFilename('testDir', 'GitVersion'));
        });

        it('removeDir should exist and a be a function', function() {
            assert.isFunction(functions.removeDir);
        });

        it('removeDir executes successfully', function() {
            assert.isOk(functions.removeDir(''));
        });

        it('handleElectronEnvironmentOptions should exist and be a function', function() {
            assert.isOk(functions.handleElectronEnvironmentOptions);
            assert.isFunction(functions.handleElectronEnvironmentOptions);
        });

        it('handleElectronEnvironmentOptions should execute successfully & return an Array', function() {
            const plugins = [];
            custom_config.vars.NODE_ENV = 'production';
            assert.isArray(functions.handleElectronEnvironmentOptions(custom_config, plugins, custom_config.vars));
            custom_config.vars.NODE_ENV = 'development';
            assert.isArray(functions.handleElectronEnvironmentOptions(custom_config, plugins, custom_config.vars));
            custom_config.vars.NODE_ENV = '';
            assert.isArray(functions.handleElectronEnvironmentOptions(custom_config, plugins, custom_config.vars));
        });

        it('executeJestTests should exist and a be a function', function() {
            assert.isFunction(functions.executeJestTests);
            assert.isFunction(functions.executeJestTestsSync);
        });

        it('runFlow should exist and be a function', function() {
            assert.isFunction(functions.runFlow);
        });

        it('runFlow should execute successfully', function() {
            const silent = true;
            const spawnSync = functions.runFlow(silent);
            assert.isOk(spawnSync);
        });
    });

    describe('gulpfile', function() {
        const gulpfile = require('../gulpfile');

        it('should exist and be truthy', function() {
            assert.isOk(gulpfile);
            assert.isObject(gulpfile);
        });

        it('gulpfile.hasSrcFolder should exist, be a function and return a boolean', function() {
            assert.isFunction(gulpfile.hasSrcFolder);
            assert.isTrue(gulpfile.hasSrcFolder(['src']));
            assert.isFalse(gulpfile.hasSrcFolder([]));
        });

        it('gulpfile.isReactNative should exist, be a function and return a boolean', function() {
            assert.isFunction(gulpfile.isReactNative);
            assert.isTrue(gulpfile.isReactNative('react-native'));
            assert.isFalse(gulpfile.isReactNative(''));
        });

        it('gulpfile.getConfigFile should exist and be a function', function() {
            assert.isFunction(gulpfile.getConfigFile);
            assert.isObject(gulpfile.getConfigFile());
        });

        it('gulpfile.errorHandler should exist and be a function', function() {
            assert.isFunction(gulpfile.errorHandler);
            assert.isUndefined(gulpfile.errorHandler(true));
        });

        it('gulpfile.lint should exist, be a function and return a truthy value', function() {
            assert.isFunction(gulpfile.lint);
            assert.isOk(gulpfile.lint(true));
        });
    });
});