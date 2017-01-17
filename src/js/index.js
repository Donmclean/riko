import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';

import Routes from './components/Routes';
import reducers from './reducers/_index';

//Include Redux Observable For 'Epic' Creation
import { epics } from './epics/_index';
import { createEpicMiddleware } from 'redux-observable';
const epicMiddleware = createEpicMiddleware(epics);

import { reduxLoggerTransformImmutable } from './helpers/_index';

//Styles
import '../sass/styles.scss';

//All redux middlewares go here
const middlewares = [routerMiddleware(browserHistory), thunk, epicMiddleware];

let composeEnhancers;

//Add Environment Specific Redux Middlewares here.
switch(process.env.NODE_ENV) {
    case 'development': {
        //adds Redux logger in dev mode with Immutable Data Structure Transforms
        middlewares.push(logger(reduxLoggerTransformImmutable));
        composeEnhancers = composeWithDevTools;
        break;
    }
    default: {
        composeEnhancers = compose;
        break;
    }
}

//Top level Redux Store
const store = createStore(
    reducers,
    composeEnhancers(applyMiddleware(...middlewares))
);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

const root = document.getElementById('root');

ReactDOM.render(
    <Provider store={store}>
        <Routes history={history}/>
    </Provider>, root);
