"use strict";
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import App from './App';
import HomePage from './Pages/HomePage/HomePage';
import NotFoundPage from './Pages/NotFoundPage/NotFoundPage';

const routeChangeHandler = (prevState, nextState) => {
    console.info('prevState, nextState', prevState, nextState);
};

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={App} onChange={routeChangeHandler}>
            <IndexRoute component={HomePage}/>
            <Route path="*" component={NotFoundPage}/>
        </Route>
    </Router>
);

export default Routes;