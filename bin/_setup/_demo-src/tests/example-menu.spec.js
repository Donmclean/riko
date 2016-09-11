"use strict";
import React from 'react'
import ReactTestUtils from 'react-addons-test-utils';
import chai from 'chai';
import Menu from '../js/components/Menu';

const renderer = ReactTestUtils.createRenderer();

const
    expect = chai.expect,
    assert = chai.assert;

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
    let MenuComponent;

    beforeEach(function() {
        renderer.render(<Menu />);
        MenuComponent = renderer.getRenderOutput();
    });

    it('should render without problems', function () {
        expect(MenuComponent).to.exist;
    });
    it('should render ul element with class: mainMenu test-autoprefixer', function() {
        assert.equal(MenuComponent.type, 'ul');
        assert.equal(MenuComponent.props.className, 'mainMenu test-autoprefixer');
    });
});