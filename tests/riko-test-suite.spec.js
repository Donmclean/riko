import chai from 'chai';
import { forEach } from 'lodash';
import * as variables from '../src/utils/variables';
import { sanitizeString, hasWhiteSpace } from '../src/utils/functions';

const assert = chai.assert;
const expect = chai.expect;

describe('Riko Test Suite', () => {
    describe('variables', () => {
        it('should all exist and be truthy', () => {
            forEach(variables, (v) => assert.isOk(v));
        });
    });

    describe('functions', () => {
        describe('sanitizeString', () => {
            it('should exist and be truthy', () => {
                assert.isOk(sanitizeString);
                expect(sanitizeString).to.be.a('function');
            });
            it('should return non escaped quotes', () => {
                assert.equal(sanitizeString('Ddf/\"'), 'Ddf/"');
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