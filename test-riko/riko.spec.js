"use strict";

const
    chai = require('chai'),
    _ = require('lodash'),
    custom_config = require('../webpack.config'),
    mock_config = require('./mock-config')();

const assert = chai.assert;

const
    REQUIRED_KEYS       = _.keys(mock_config.config),
    VARIABLES           = custom_config.vars,

    configKeys          = _.keys(custom_config),
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
});