import { combineReducers, createStore } from 'redux';

//IMPORT ALL REDUCERS HERE
import { routerReducer } from 'react-router-redux';
import postSelectorReducer from './components/Shared/PostSelector/postSelectorReducer';
import counterReducer from './components/Shared/CounterClicker/counterReducer';

//ADD ALL REDUCERS TO THE 'allReducers' OBJECT HERE
const allReducers = {
    routing: routerReducer,
    postSelectorReducer,
    counterReducer
};

//REDUCERS ARE THEN COMBINED TO BE USED WITH REDUX
const combinedReducers = combineReducers(allReducers);

//THIS OBJECT IS EXPORTED AND CAN/WILL BE USED FOR TESTING PURPOSES
export const mockStoreInitialState = createStore(combinedReducers).getState();

export default combinedReducers;