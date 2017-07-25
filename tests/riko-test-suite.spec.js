import chai from 'chai';
import { baseDir, packageJson, cwd } from '../utils/variables';
import { sanitizeString } from '../utils/functions';

const assert = chai.assert;
const expect = chai.expect;

describe('Riko Test Suite', () => {
    describe('variables', () => {
        describe('baseDir', () => {
            it('should exist and be truthy', () => {
                assert.isOk(baseDir);
                expect(baseDir).to.be.a('string');
            });
        });
        describe('packageJson', () => {
            it('should exist and be truthy', () => {
                assert.isOk(packageJson);
                expect(packageJson).to.be.an('object');
            });
        });
        describe('cwd', () => {
            it('should exist and be truthy', () => {
                assert.isOk(cwd);
                expect(cwd).to.be.a('string');
            });
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
    });
});