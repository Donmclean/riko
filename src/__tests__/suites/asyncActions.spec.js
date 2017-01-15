"use strict";

import React from 'react';
import _ from 'lodash';
import * as asyncActions from '../../js/actions/asyncActionCreators';
import * as types from '../../js/constants/actions/actionTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// Useful for not making direct api requests when testing
// import nock from 'nock';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Async Test Suite', () => {
    //Action Creator Specific Tests would go here
    describe('Async Actions', () => {
        it(`setPosts should create an ${types.UPDATE_POSTS} action`, () => {
            const expectedAction = {
                type: types.UPDATE_POSTS
            };

            expect(asyncActions.setPosts()).toEqual(expectedAction);
        });

        it(`updatePostNumber should create an ${types.UPDATE_POST_NUMBER} action`, () => {
            const postNumber = 10;

            const dispatch = asyncActions.updatePostNumber(postNumber);
            const expectedDispatch = { type: types.UPDATE_POST_NUMBER, data: 10 };

            expect(dispatch).toEqual(expectedDispatch);
        });

        it('fetchPosts should return a dispatch function', () => {
            const postId = 1;
            const dispatch = asyncActions.fetchPosts(postId);
            expect(_.isFunction(dispatch)).toEqual(true);
        });
    });

    describe('Async Dispatch Actions', () => {
        it(`fetchPosts creates ${types.UPDATE_POSTS} when fetching posts has been done`, () => {
            const postId = 1;

            const store = mockStore();

            return store.dispatch(asyncActions.fetchPosts(postId))
                .then(() => { // return of async actions
                    expect(store.getActions()).toMatchSnapshot();
                });
        });

        it('fetchPosts should return empty array upon error occurring when fetching invalid post number or (404)', () => {
            const postId = 0;
            const store = mockStore();

            return store.dispatch(asyncActions.fetchPosts(postId))
                .then(() => { // return of async actions
                    expect(store.getActions()).toEqual([]);
                    expect(_.isEmpty(store.getActions())).toEqual(true);
                });
        });
    });
});