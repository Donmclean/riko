"use strict";

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import App from '../../src/js/components/App.js';

const renderer = ReactTestUtils.createRenderer();

// TEST 1
function sum(a, b) {
    return a + b;
}

describe('sum()2', function() {
    it('should save add two numbers', function() {
        expect(sum(1,3)).toBe(4);
    });
});

// TEST 2
describe('DOM Essentials', function () {
    it('window is available', function () {
        expect(window).toBeTruthy();
    });
    it('document is available', function () {
        expect(document).toBeTruthy();
    });
    it('React TestUtils is available', function () {
        expect(ReactTestUtils).toBeTruthy();
    });
});

// TEST 3
describe('App', function () {

    renderer.render(<App />);
    let result;
    let app;

    beforeEach(function() {
        app = new App;
        renderer.render(<App />);
        result = renderer.getRenderOutput();
    });

    it('renders without problems', function () {
        expect(result).toBeTruthy();
    });
    it('should render a div component', function() {
        expect(result.type).toEqual('div');
    });

    describe('log()', function () {
        it('should return a string', function() {
            let result = app.log();
            expect(typeof '').toBe(typeof result);
        });
    });

});