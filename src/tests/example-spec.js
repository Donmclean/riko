"use strict";
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils';
import chai from 'chai';
import Menu from '../js/components/Menu';

const renderer = ReactTestUtils.createRenderer();

const
    expect = chai.expect,
    assert = chai.assert;


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

describe('Menu', function () {


    renderer.render(<Menu />);
    let result;

    beforeEach(function() {
        renderer.render(<Menu />);
        result = renderer.getRenderOutput();
    });

    it('renders without problems', function () {
        expect(result).to.exist;
    });
    it('should render div component with class equals to veryFirstDiv', function() {
        assert.equal(result.type, 'ul');
        assert.equal(result.props.className, 'mainMenu test-autoprefixer');
    });
});

//TEST 3

// let React = require('react/addons'),
//     assert = require('assert'),
//     TodoItem = require('../../common/components/todo-item'),
//     TestUtils = React.addons.TestUtils;
//
// describe('Todo-item component', function(){
//     before('render and locate element', function() {
//         var renderedComponent = TestUtils.renderIntoDocument(
//             <TodoItem done={false} name="Write Tutorial"/>
//         );
//
//         // Searching for <input> tag within rendered React component
//         // Throws an exception if not found
//         var inputComponent = TestUtils.findRenderedDOMComponentWithTag(
//             renderedComponent,
//             'input'
//         );
//
//         this.inputElement = inputComponent.getDOMNode();
//     });
//
//     it('<input> should be of type "checkbox"', function() {
//         assert(this.inputElement.getAttribute('type') === 'checkbox');
//     });
//
//     it('<input> should not be checked', function() {
//         assert(this.inputElement.checked === false);
//     });
// });