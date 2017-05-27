"use strict";
const
    chai        = require('chai'),
    assert      = chai.assert,
    expect      = chai.expect,

    _v          = require('../utils/variables')(),
    funcs       = require('../utils/functions')(),
    packageJson = require('../package.json');

describe('Riko Test Suite', () => {
    describe('_v = variables', () => {
        it('should exist and be truthy', () => {
            _v._.forEach(_v, (variable) => assert.isOk(variable, `${variable} needs to be defined`));
        });
    });

    describe('package.json', () => {
        it('should exist and be truthy', () => {
            assert.isOk(packageJson);
        });
        it('mocha should exist and be truthy', () => {
            assert.isOk(packageJson.dependencies.mocha);
        });
        it('chai should exist and be truthy', () => {
            assert.isOk(packageJson.dependencies.chai);
        });
    });

    describe('funcs', () => {
        it('should exist, be truthy, be an object and be have values', () => {
            assert.isOk(funcs);
            assert.isObject(funcs);
            assert.isNotTrue(_v._.isEmpty(funcs), 'should not be empty');
        });

        it('removeDir should exist and a be a function', () => {
            assert.isFunction(funcs.removeDir);
        });

        it('removeDir executes successfully and return a promise', () => {
            expect(funcs.removeDir('some random dir')).to.be.an('object');
        });

        it('hotExecuteTests should exist and be a function', () => {
            assert.isFunction(funcs.hotExecuteTests);
        });

        it('hotExecuteFlowTests should exist and be a function', () => {
            assert.isFunction(funcs.hotExecuteFlowTests);
        });
    });
});