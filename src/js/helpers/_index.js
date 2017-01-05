import Immutable from 'immutable';

//Needed To Transform Immutable State in Redux Store in Redux Logger
export const reduxLoggerTransformImmutable = {
    stateTransformer: (state) => {
        let newState = {};

        for (let i of Object.keys(state)) {
            if (Immutable.Iterable.isIterable(state[i])) {
                newState[i] = state[i].toJS();
            } else {
                newState[i] = state[i];
            }
        }

        return newState;
    }
};