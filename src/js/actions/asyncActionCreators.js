"use strict";
import axios from 'axios';
import * as types from '../../js/constants/actions/actionTypes';

export const updatePostNumber = (postNumber) => ({
    type: types.UPDATE_POST_NUMBER,
    data: postNumber
});

export const setPosts = (posts) => ({
    type: types.UPDATE_POSTS,
    data: posts
});

export const fetchPosts = (postId) => {
    return (dispatch, getState) => {
        return axios.get(`https://jsonplaceholder.typicode.com/posts/${postId}`)
            .then((response) => {
                dispatch(setPosts(response.data));
            })
            .catch((error) => {
                return new Error(error);
            });
    };
};