import * as types from '../constants/actions/actionTypes';

//The *KEY* is to receive an action that will trigger another action that actually has direct influence on state
//We can call this an Epic listener. (eg: 'SHOULD_INCREMENT')
//notice the convention of adding 'SHOULD_' in front of the action type.
export const counterEpic = action$ =>
    action$.ofType(types.SHOULD_INCREMENT)
        .debounceTime(1000)
        .mapTo({ type: types.INCREMENT });
