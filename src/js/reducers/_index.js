import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import asyncReducer from './asyncReducer';
import counterReducer from './counterReducer';

export default combineReducers({
    asyncReducer,
    counterReducer,
    routing: routerReducer
});