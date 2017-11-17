import chai from 'chai';
import { forEach } from 'lodash';
import * as variables from '../src/utils/variables';
import { hasWhiteSpace, validateRikoConfig } from '../src/utils/functions';

const assert = chai.assert;
const expect = chai.expect;

describe('Riko Test Suite', () => {
    describe('variables', () => {
        it('should all exist and be truthy', () => {
            forEach(variables, (v) => assert.isOk(v));
        });
    });

    describe('functions', () => {
        describe('validateRikoConfig', () => {
            it('should exist and be truthy', () => {
                assert.isOk(validateRikoConfig);
                expect(validateRikoConfig).to.be.a('function');
            });
            it('should validate a generic riko config file', () => {
                const runCommands = ['react-dev', 'react-prod', 'electron-dev', 'electron-prod'];

                forEach(runCommands, (runCommand) => {
                    assert.isOk(validateRikoConfig({
                        setWebpackConfig: () => {},
                        setCustomBoilerplatePath: () => {},
                        setWebpackEventHooks: () => {},
                        setElectronPackagerOptions: () => {}
                    }, runCommand));
                });
            });
        });
        describe('hasWhiteSpace', () => {
            it('should exist and be truthy', () => {
                assert.isOk(hasWhiteSpace);
                expect(hasWhiteSpace).to.be.a('function');
            });
            it('should return true if string has white space', () => {
                assert.equal(hasWhiteSpace('has white space'), true);
                assert.equal(hasWhiteSpace('haswhitespace '), true);
                assert.equal(hasWhiteSpace(' haswhitespace'), true);
            });
            it('should return false if string has does not have white space', () => {
                assert.equal(hasWhiteSpace('haswhitespace'), false);
            });
        });
    });
});