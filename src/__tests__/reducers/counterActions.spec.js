"use strict";

import React from 'react';
import * as counterActions from '../../js/actions/counterActionCreators';
import * as types from '../../js/constants/actions/actionTypes';

describe('Counter Actions', () => {
    it('should create a increment action', () => {
        const expectedAction = {
            type: types.INCREMENT
        };
        expect(counterActions.increment()).toEqual(expectedAction);
    });
    it('should create a decrement action', () => {
        const expectedAction = {
            type: types.DECREMENT
        };
        expect(counterActions.decrement()).toEqual(expectedAction);
    });
});