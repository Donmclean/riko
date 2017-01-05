"use strict";
import { Map } from 'immutable';

/*---------------------*/
/*--WITH-- Immutable JS*/
/*---------------------*/
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

/*------------------------*/
/*--WITHOUT-- Immutable JS*/
/*------------------------*/
//Every reducer should have an initial state variable here
// const initialState = {
//     value: 0
// };
//
// const counterReducer = (state = initialState, action) => {
//     switch (action.type) {
//         case 'INCREMENT': {
//             return {value: state.value + 1};
//         }
//         case 'DECREMENT': {
//             return {value: state.value - 1};
//         }
//         default: {
//             break;
//         }
//     }
//
//     return state;
// };

export default counterReducer;