"use strict";

import React from 'react';
import _ from 'lodash';
import * as asyncActions from '../../js/actions/asyncActionCreators';
import * as types from '../../js/constants/actions/actionTypes';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Async Actions', () => {
    afterEach(() => {
        nock.cleanAll();
    });

    it('getPosts should create a get posts action', () => {
        const expectedAction = {
            type: types.GET_POSTS
        };

        expect(asyncActions.getPosts()).toEqual(expectedAction);
    });

    it('doGetPosts should return a function', () => {
        const postId = 1;
        const dispatch = asyncActions.doGetPosts(postId);
        expect(_.isFunction(dispatch)).toEqual(true);
    });

    it('doGetPosts creates GET_POSTS when fetching posts has been done', () => {
        const postId = 1;
        const expectedData = [{
            type: 'GET_POSTS',
            data: {
                userId: 1,
                id: 1,
                title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
                body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
            }
        }];

        const store = mockStore();

        return store.dispatch(asyncActions.doGetPosts(postId))
            .then(() => { // return of async actions
                expect(store.getActions()).toEqual(expectedData);
            });
    });

    it('doGetPosts should return empty array upon error occurring when fetching invalid post number or (404)', () => {
        const postId = 101;
        const store = mockStore();

        return store.dispatch(asyncActions.doGetPosts(postId))
            .then(() => { // return of async actions
                expect(store.getActions()).toEqual([]);
            });
    });

    it('updateInputValue should return valid data object', () => {
        const postNumber = 10;

        const dispatch = asyncActions.updateInputValue(postNumber);
        const expectedDispatch = { type: 'UPDATE_INPUT_VALUE', data: { postNumber: 10 } };

        expect(dispatch).toEqual(expectedDispatch);
    });
});