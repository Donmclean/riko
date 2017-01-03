import { combineEpics } from 'redux-observable';
import { counterEpic } from './counterEpic';

export const epics = combineEpics(
    counterEpic
);