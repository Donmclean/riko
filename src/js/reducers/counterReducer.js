"use strict";
import { Map } from 'immutable';

//Every reducer should have an initial state variable here
const initialState = Map({
    value: 0
});

const counterReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'INCREMENT': {
            return state.update('value', (value) => value + 1);
        }
        case 'DECREMENT': {
            return state.update('value', (value) => value - 1);
        }
        default: {
            break;
        }
    }

    return state;
};

export default counterReducer;