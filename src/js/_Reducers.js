import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import postsSelectorReducer from './components/Shared/PostSelector/postSelectorReducer';
import counterReducer from './components/Shared/CounterClicker/counterReducer';

export default combineReducers({
    postsSelectorReducer,
    counterReducer,
    routing: routerReducer
});