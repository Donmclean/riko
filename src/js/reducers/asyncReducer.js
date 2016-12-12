"use strict";
import _ from 'lodash';
import * as types from '../../js/constants/actions/actionTypes';

const initalState = {
    id: 0,
    userId: 0,
    title: "Intial State Title",
    body: "Pending Request..",
    postNumber: 0
};

const asyncReducer = (state = initalState, action) => {
    switch (action.type) {
        case types.GET_POSTS: {
            return _.assign({}, state, action.data);
        }
        case types.UPDATE_INPUT_VALUE: {
            return _.assign({}, state, action.data);
        }
        default: {
            return state;
        }
    }
};

export default asyncReducer;