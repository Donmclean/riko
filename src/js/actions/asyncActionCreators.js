"use strict";
import axios from 'axios';
import * as types from '../../js/constants/actions/actionTypes';

export const updateInputValue = (postNumber) => ({
    type: types.UPDATE_INPUT_VALUE,
    data: {postNumber}
});

export const getPosts = (posts) => ({
    type: types.GET_POSTS,
    data: posts
});

export const doGetPosts = (postId) => {
    return (dispatch, getState) => {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then((response) => {
                dispatch(getPosts(response.data));
            })
            .catch((error) => {
                return new Error(error);
            });
    };
};