"use strict";

import React from 'react';
import * as counterActions from '../../js/actions/counterActionCreators';
import * as types from '../../js/constants/actions/actionTypes';
import counterReducer from '../../js/reducers/counterReducer';
import { Map } from 'immutable';

//For testing components
import CounterClicker from '../../js/components/shared/CounterClicker';

import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
const middlewares = []; //eg: [thunk] for async
const mockStore = configureStore(middlewares);

describe('Counter Actions', () => {
    //Initialize mockstore with inital state of Reducer
    const initialState = {
        counterReducer: Map({
            value: 0
        })
    };
    const store = mockStore(initialState);

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
        const defaultState = Map({value: 0});
        const expectedState = Map({value: 1});

        //Execute
        const newState = counterReducer(defaultState, counterActions.increment());

        //Verify
        expect(newState).toEqual(expectedState);
    });

    it(`${types.DECREMENT} executes successfully --WITH-- IMMUTABLE JS`, () => {
        //Setup
        const defaultState = Map({value: 0});
        const expectedState = Map({value: -1});

        //Execute
        const newState = counterReducer(defaultState, counterActions.decrement());

        //Verify
        expect(newState).toEqual(expectedState);
    });

    it('renders <CounterClicker /> component successfully in to the DOM with required props', () => {
        //Verify props
        const wrapper = shallow(<CounterClicker store={store}/>);
        expect(wrapper.prop('store')).toEqual(store);

        //Verify Component Snapshot
        const component = renderer.create(
            <CounterClicker store={store}/>
        );
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});