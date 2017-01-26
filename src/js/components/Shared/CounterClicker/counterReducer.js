"use strict";
import { Map } from 'immutable';
import * as types from '../../../constants/actionTypes';

//Every reducer should have an initial state variable here
export const initialState = Map({ // Export it for testing purposes
    value: 0
});

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.SHOULD_INCREMENT: {
            break;
        }
        case types.INCREMENT: {
            return state.update('value', (value) => value + 1);
        }
        case types.SHOULD_DECREMENT: {
            break;
        }
        case types.DECREMENT: {
            return state.update('value', (value) => value - 1);
        }
        default: {
            break;
        }
    }

    return state;
};

export default counterReducer;