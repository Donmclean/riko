//Must import the observable of which has methods you wish to use
import { Observable } from 'rxjs';
import * as types from '../constants/actions/actionTypes';

export const counterEpic = action$ =>
    action$.filter(action => action.type === types.INCREMENT)
        .delay(1000)
        .mapTo({ type: types.DECREMENT });
        // .takeUntil(action$.ofType(types.DECREMENT));// WORKS!
