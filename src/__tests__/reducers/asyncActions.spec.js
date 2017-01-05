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

describe('Async Actions', () => {
    it('setPosts should create a get posts action', () => {
        const expectedAction = {
            type: types.UPDATE_POSTS
        };

        expect(asyncActions.setPosts()).toEqual(expectedAction);
    });

    it('fetchPosts should return a function', () => {
        const postId = 1;
        const dispatch = asyncActions.fetchPosts(postId);
        expect(_.isFunction(dispatch)).toEqual(true);
    });

    it('fetchPosts creates UPDATE_POSTS when fetching posts has been done', () => {
        const postId = 1;
        const expectedData = [{
            type: 'UPDATE_POSTS',
            data: {
                userId: 1,
                id: 1,
                title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
            }
        }];

        const store = mockStore();

        return store.dispatch(asyncActions.fetchPosts(postId))
            .then(() => { // return of async actions
                expect(store.getActions()).toEqual(expectedData);
            });
    });

    it('fetchPosts should return empty array upon error occurring when fetching invalid post number or (404)', () => {
        const postId = 0;
        const store = mockStore();

        return store.dispatch(asyncActions.fetchPosts(postId))
            .then(() => { // return of async actions
                expect(store.getActions()).toEqual([]);
            });
    });

    it('updatePostNumber should return valid data object', () => {
        const postNumber = 10;

        const dispatch = asyncActions.updatePostNumber(postNumber);
        const expectedDispatch = { type: 'UPDATE_POST_NUMBER', data: 10 };

        expect(dispatch).toEqual(expectedDispatch);
    });
});