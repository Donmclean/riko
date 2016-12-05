"use strict";
import _ from 'lodash';

const counterReducer = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT': {
            return state + 1;
        }

        case 'DECREMENT': {
            return state - 1;
        }
        default: {
            break;
        }
    }

    return state;
};

export default counterReducer;