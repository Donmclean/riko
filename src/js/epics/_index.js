//IMPORTANT: MUST IMPORT OBSERVABLE SO THAT METHODS ARE AVAILABLE TO 'redux-observable'
import { Observable } from 'rxjs'; // eslint-disable-line no-unused-vars

import { combineEpics } from 'redux-observable';
import { counterEpic } from './counterEpic';

export const epics = combineEpics(
    counterEpic
);