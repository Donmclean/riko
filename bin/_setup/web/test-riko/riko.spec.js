"use strict";
const
    chai = require('chai'),
    customConfig = require('../webpack/config'),
    config = require('../webpack.config'),
    mock_config = require('./mock-config')();

const assert = chai.assert;

const
    _v                          = customConfig.vars,
    requiredConfigKeys          = _v._.keys(mock_config.config),
    requiredCustomConfigKeys    = _v._.keys(mock_config.customConfig),
    configKeys                  = _v._.keys(config),
    customConfigKeys            = _v._.keys(customConfig),

    funcs                       = require('../webpack/functions')(_v),
    mockConfig                  = mock_config.config,
    mockCustomConfig            = mock_config.customConfig,
    mockdevDependencies         = mock_config.packageJson.devDependencies;

describe('Config', () => {
    describe('requiredConfigKeys', () => {
        it('should exist and be truthy', () => {
            funcs.testRequiredFields(assert, requiredConfigKeys, configKeys, 'config');
            funcs.testRequiredFields(assert, requiredCustomConfigKeys, customConfigKeys, 'customConfig');
        });
        it('should be of valid types', () => {
            funcs.testRequiredTypes(assert, config, mockConfig);
            funcs.testRequiredTypes(assert, customConfig, mockCustomConfig);
        });
    });

    describe('_v = variables', () => {
        it('should exist and be truthy', () => {
            _v._.forEach(_v, variable => {
                assert.isOk(variable, `${variable} needs to be defined`);
            });
        });
    });

    describe('package.json', () => {
        const packageJson = require(customConfig.packageJson);

        it('should exist and be truthy', () => {
            assert.isOk(packageJson);
        });
        it('mocha should exist and be truthy', () => {
            assert.isOk(packageJson.devDependencies.mocha);
        });
        it('chai should exist and be truthy', () => {
            assert.isOk(packageJson.devDependencies.chai);
        });
        it('jest should exist and be truthy', () => {
            assert.isOk(packageJson.devDependencies.jest);
            assert.isOk(packageJson.devDependencies['jest-cli']);
        });
        it('should have required devDependencies', () => {
            _v._.forEach(mockdevDependencies, (val, dep) => {
                assert.isTrue(_v._.includes(_v._.keys(packageJson.devDependencies), dep), `${dep} needs to be present in package.json`);
            });
        });
    });

    describe('functions', () => {
        const functions = require('../webpack/functions')(customConfig.vars);

        it('should exist, be truthy, be an object and be have values', () => {
            assert.isOk(functions);
            assert.isObject(functions);
            assert.isNotTrue(_v._.isEmpty(functions), 'should not be empty');
        });

        it('insertGitSHAIntoFilename should exist and a be a function', () => {
            assert.isFunction(functions.insertGitSHAIntoFilename);
        });

        it('insertGitSHAIntoFilename should return a string', () => {
            assert.isString(functions.insertGitSHAIntoFilename('', 'GitVersion'));
            assert.isString(functions.insertGitSHAIntoFilename('testDir', 'GitVersion'));
        });

        it('removeDir should exist and a be a function', () => {
            assert.isFunction(functions.removeDir);
        });

        it('removeDir executes successfully', () => {
            assert.isOk(functions.removeDir(''));
        });

        it('handleElectronEnvironmentOptions should exist and be a function', () => {
            assert.isOk(functions.handleElectronEnvironmentOptions);
            assert.isFunction(functions.handleElectronEnvironmentOptions);
        });

        it('handleElectronEnvironmentOptions should execute successfully & return an Array', () => {
            customConfig.vars.NODE_ENV = 'production';
            assert.isArray(functions.handleElectronEnvironmentOptions(config, customConfig));
            customConfig.vars.NODE_ENV = 'development';
            assert.isArray(functions.handleElectronEnvironmentOptions(config, customConfig));
            customConfig.vars.NODE_ENV = '';
            assert.isArray(functions.handleElectronEnvironmentOptions(config, customConfig));
        });

        it('executeJestTests should exist and a be a function', () => {
            assert.isFunction(functions.executeJestTests);
        });

        it('runFlow should exist and be a function', () => {
            assert.isFunction(functions.runFlow);
        });
    });

    describe('gulpfile', () => {
        const gulpfile = require('../gulpfile');

        it('should exist and be truthy', function() {
            assert.isOk(gulpfile);
            assert.isObject(gulpfile);
        });

        it('gulpfile.getConfigFile should exist and be a function', () => {
            assert.isFunction(gulpfile.getConfigFile);
            assert.isObject(gulpfile.getConfigFile());
        });

        it('gulpfile.errorHandler should exist and be a function', () => {
            assert.isFunction(gulpfile.errorHandler);
            assert.isUndefined(gulpfile.errorHandler(true));
        });

        it('gulpfile.lint should exist, be a function and return a truthy value', () => {
            assert.isFunction(gulpfile.lint);
            assert.isOk(gulpfile.lint(true));
        });
    });
});