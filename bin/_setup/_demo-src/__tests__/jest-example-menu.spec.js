"use strict";

import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

const renderer = ReactTestUtils.createRenderer();

import Menu from '../js/components/Menu.jsx';

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
        expect(result.props.className).toEqual('mainMenu test-autoprefixer');
    });
});