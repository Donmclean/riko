import React from 'react';
import * as counterActions from '../../../actions/counterActionCreators';
import * as types from '../../../constants/actions/actionTypes';
import counterReducer, { initialState } from '../../../reducers/counterReducer';

//Include Redux Observable For 'Epic' Creation
import { epics } from '../../../epics/_index';
import { createEpicMiddleware } from 'redux-observable';
const epicMiddleware = createEpicMiddleware(epics);

import { Map } from 'immutable';

//For testing components
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
const middlewares = [epicMiddleware]; //eg: [thunk] for async | eg: [epicMiddleware] for testing epics
const mockStore = configureStore(middlewares);

//Component to be Tested
import CounterClicker from './CounterClicker';

//Test suite designed to test the functionality of
describe('Counter Test Suite', () => {
    let store;

    beforeEach(() => {
        //Initialize mockStore with initial state of reducer
        store = mockStore({counterReducer: initialState});
    });

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

    //Epic Specific Tests would go here
    describe('Counter Epic', () => {
        it(`${types.SHOULD_INCREMENT} executes/returns the expected actions successfully`, (done) => {
            store.dispatch(counterActions.shouldIncrement());

            //Since the counter epic has a debounceTime attached we have to provide
            //a setTimeout after the dispatch function is called for the Epic to complete.
            setTimeout(() => {
                expect(store.getActions()).toMatchSnapshot();
                done();
            }, 1100);

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

            //Render Component Tree
            const component = renderer.create(
                <CounterClicker store={store}/>
            );

            //Verify Component Snapshot
            //call component to JSON before matching snapshot
            expect(component.toJSON()).toMatchSnapshot();
        });
    });
});