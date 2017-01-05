"use strict";

import React from 'react';
import * as counterActions from '../../js/actions/counterActionCreators';
import * as types from '../../js/constants/actions/actionTypes';
import counterReducer from '../../js/reducers/counterReducer';

import { Map } from 'immutable';

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

    it(`${types.INCREMENT} executes successfully --WITH-- IMMUTABLE JS`, () => {
        //Setup
        const initialState = Map({value: 0});
        const expectedState = Map({value: 1});

        //Execute
        const newState = counterReducer(initialState, counterActions.increment());

        //Verify
        expect(newState).toEqual(expectedState);
    });

    it(`${types.DECREMENT} executes successfully --WITH-- IMMUTABLE JS`, () => {
        //Setup
        const initialState = Map({value: 0});
        const expectedState = Map({value: -1});

        //Execute
        const newState = counterReducer(initialState, counterActions.decrement());

        //Verify
        expect(newState).toEqual(expectedState);
    });

    // it(`${types.INCREMENT} executes successfully --WITHOUT-- IMMUTABLE JS`, () => {
    //     //Setup
    //     const initialState = {value: 0};
    //     const expectedState = {value: 1};
    //
    //     //Execute
    //     const newState = counterReducer(initialState, counterActions.increment());
    //
    //     //Verify
    //     expect(newState).toEqual(expectedState);
    // });

    // it(`${types.DECREMENT} executes successfully --WITHOUT-- IMMUTABLE JS`, () => {
    //     //Setup
    //     const initialState = {value: 0};
    //     const expectedState = {value: -1};
    //
    //     //Execute
    //     const newState = counterReducer(initialState, counterActions.decrement());
    //
    //     //Verify
    //     expect(newState).toEqual(expectedState);
    // });
});