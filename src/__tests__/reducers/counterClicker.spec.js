"use strict";

import React from 'react';
import * as counterActions from '../../js/actions/counterActionCreators';
import * as types from '../../js/constants/actions/actionTypes';
import counterReducer, { initialState } from '../../js/reducers/counterReducer';
import { Map } from 'immutable';

//For testing components
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
const middlewares = []; //eg: [thunk] for async
const mockStore = configureStore(middlewares);

//Component to be Tested
import CounterClicker from '../../js/components/Shared/CounterClicker';

//Test suite designed to test the functionality of
describe('Counter Test Suite', () => {
    //Initialize mockStore with initial state of Reducer
    const store = mockStore({counterReducer: initialState});

    //Action Creator Specific Tests would go here
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

    //Reducer Specific Tests would go here
    describe('Counter Reducer', () => {
        it(`${types.INCREMENT} executes successfully`, () => {
            //Setup
            const expectedState = Map({value: 1});

            //Execute
            const newState = counterReducer(initialState, counterActions.increment());

            //Verify
            expect(newState).toEqual(expectedState);
        });

        it(`${types.DECREMENT} executes successfully`, () => {
            //Setup
            const expectedState = Map({value: -1});

            //Execute
            const newState = counterReducer(initialState, counterActions.decrement());

            //Verify
            expect(newState).toEqual(expectedState);
        });
    });

    //Component Specific Tests would go here
    describe('Counter Component', () => {
        it('renders <CounterClicker /> component successfully in to the DOM with required props & state', () => {
            //Verify props
            const wrapper = shallow(<CounterClicker store={store}/>);
            expect(wrapper.prop('store')).toEqual(store);

            //Verify that initial State of the store is rendered correctly
            expect(wrapper.state().storeState).toEqual(store.getState());

            //Verify Component Snapshot
            const component = renderer.create(
                <CounterClicker store={store}/>
            );

            //remember to call component to JSON before matching snapshot
            expect(component.toJSON()).toMatchSnapshot();
        });
    });
});