"use strict";

jest.unmock('../src/js/components/Menu.jsx');
jest.unmock('../src/js/components/App.js');

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

const renderer = ReactTestUtils.createRenderer();

import Menu from '../src/js/components/Menu.jsx';
import App from '../src/js/components/App.js';

// TEST 1
function sum(a, b) {
    return a + b;
}

describe('sum()', function() {
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
describe('Menu', function () {

    renderer.render(<Menu />);
    let result;

    beforeEach(function() {
        renderer.render(<Menu />);
        result = renderer.getRenderOutput();
    });

    it('renders without problems', function () {
        expect(result).toBeTruthy();
    });
    it('should render ul component with class: mainMenu test-autoprefixer', function() {
        expect(result.type).toEqual('ul');
        // expect(result.props.className).toEqual('mainMenu test-autoprefixer');
    });
});