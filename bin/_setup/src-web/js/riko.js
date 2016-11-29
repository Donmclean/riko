/* eslint-env browser */

//IMPORTANT! THIS IS REQUIRED FOR HOT MODULE REPLACEMENT!
if(process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept();
}

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

//Styles
import styles from '../sass/styles.scss';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
