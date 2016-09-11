"use strict";
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils';
import chai from 'chai';
import App from '../../src/js/components/App.js';

const renderer = ReactTestUtils.createRenderer();

const
    expect = chai.expect,
    assert = chai.assert;

//TODO: fix style errors in testing

// TEST 1
function sum(a, b) {
    return a + b;
}

describe('sum()', function() {
    it('should save add two numbers', function(done) {
        let result = sum(1,3);
        expect(result).to.equal(4);
        done();
    });
});

// // TEST 2
describe('DOM Essentials', function () {
    it('window is available', function () {
        expect(window).to.exist;
    });
    it('document is available', function () {
        expect(document).to.exist;
    });
    it('React TestUtils is available', function () {
        expect(ReactTestUtils).to.exist;
    });
});

describe('App', function () {

    renderer.render(<App />);
    let AppComponent;

    beforeEach(function() {
        renderer.render(<App />);
        AppComponent = renderer.getRenderOutput();
    });

    it('should render without problems', function () {
        expect(AppComponent).to.exist;
    });

    it('should render a div element', function() {
        assert.equal(AppComponent.type, 'div');
    });
});