"use strict";
jest.autoMockOff();
// jest.unmock('../src/js/components/Menu');

// import Menu from '../src/js/components/Menu';

// const renderer = ReactTestUtils.createRenderer();
//
// const
//     expect = chai.expect,
//     assert = chai.assert;

const React = require('react');
const ReactTestUtils = require('react-addons-test-utils');
// const Menu = require('js/components/Menu');
// console.log("__dirname",__dirname);

// TEST 1
function sum(a, b) {
    return a + b;
}

describe('sum()', function() {
    it('should save add two numbers', function() {
        expect(sum(1,3)).toBe(4);
    });
});

// // TEST 2
// describe('DOM Essentials', function () {
//     it('window is available', function () {
//         expect(window).to.exist;
//     });
//     it('document is available', function () {
//         expect(document).to.exist;
//     });
//     it('React TestUtils is available', function () {
//         expect(ReactTestUtils).to.exist;
//     });
// });
//
// describe('Menu', function () {
//
//
//     renderer.render(<Menu />);
//     let result;
//
//     beforeEach(function() {
//         renderer.render(<Menu />);
//         result = renderer.getRenderOutput();
//     });
//
//     it('renders without problems', function () {
//         expect(result).to.exist;
//     });
//     it('should render ul component with class: mainMenu test-autoprefixer', function() {
//         assert.equal(result.type, 'ul');
//         assert.equal(result.props.className, 'mainMenu test-autoprefixer');
//     });
// });