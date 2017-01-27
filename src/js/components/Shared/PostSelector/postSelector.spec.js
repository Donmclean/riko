import React from 'react';
import _ from 'lodash';
import * as postSelectorActions from './postSelectorActionCreators';
import * as types from '../../../constants/actionTypes';

//For testing components
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
const middlewares = [ thunk ];
const mockStore = configureStore(middlewares);

// Useful for not making direct api requests when testing
// import nock from 'nock';

//This contains all reducers and their 'initialState' ready to be placed in 'mockStore' for testing
//This should be ideal for testing dummy components
import { mockStoreInitialState } from '../../../_Reducers';

//Component to be Tested
import PostSelector from './index';

describe('postSelector Test Suite', () => {
    let store;

    beforeEach(() => {
        //Initialize mockStore with initial state of the reducers
        store = mockStore(mockStoreInitialState);
    });

    //Action Creator Specific Tests would go here
    describe('postSelector Actions', () => {
        it(`setPosts should create an ${types.UPDATE_POSTS} action`, () => {
            //OLD WAY
            // const expectedAction = { type: types.UPDATE_POSTS };
            // expect(postSelectorActions.setPosts()).toEqual(expectedAction);

            //NEW WAY!!!
            expect(postSelectorActions.setPosts()).toMatchSnapshot();
        });

        it(`updatePostNumber should create an ${types.UPDATE_POST_NUMBER} action`, () => {
            const postNumber = 10;

            const dispatch = postSelectorActions.updatePostNumber(postNumber);

            //OLD WAY
            // const expectedDispatch = { type: types.UPDATE_POST_NUMBER, data: 10 };
            // expect(dispatch).toEqual(expectedDispatch);

            //NEW WAY!!!
            expect(dispatch).toMatchSnapshot();
        });

        it('fetchPosts should return a dispatch function', () => {
            const postId = 1;
            const dispatch = postSelectorActions.fetchPosts(postId);
            expect(_.isFunction(dispatch)).toEqual(true);
        });
    });

    describe('postSelector Dispatch Actions', () => {
        it(`fetchPosts creates ${types.UPDATE_POSTS} when fetching posts has been done`, () => {
            const postId = 1;

            return store.dispatch(postSelectorActions.fetchPosts(postId))
                .then(() => { // return of async actions
                    expect(store.getActions()).toMatchSnapshot();
                });
        });

        it('fetchPosts should return empty array upon error occurring when fetching invalid post number or (404)', () => {
            const postId = 0;

            return store.dispatch(postSelectorActions.fetchPosts(postId))
                .then(() => { // return of async actions
                    expect(store.getActions()).toEqual([]);
                    expect(_.isEmpty(store.getActions())).toEqual(true);
                });
        });
    });

    describe('PostSelector Component', () => {
        it('renders <PostSelector /> component successfully in to the DOM with required props & state', () => {

            //Verify props
            const wrapper = shallow(<PostSelector store={store}/>);
            expect(wrapper.prop('store')).toEqual(store);

            //Verify that initial State of the store is rendered correctly
            expect(wrapper.state().storeState).toEqual(store.getState());

            //Render Component Tree
            const component = renderer.create(
                <PostSelector store={store}/>
            );

            //Verify Component Snapshot
            //call component to JSON before matching snapshot
            expect(component.toJSON()).toMatchSnapshot();
        });
    });
});