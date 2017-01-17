import * as types from '../../js/constants/actions/actionTypes';

export const shouldIncrement = () => ({
    type: types.SHOULD_INCREMENT
});

export const increment = () => ({
    type: types.INCREMENT
});

export const shouldDecrement = () => ({
    type: types.SHOULD_DECREMENT
});

export const decrement = () => ({
    type: types.DECREMENT
});