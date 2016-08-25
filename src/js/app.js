/* eslint-env browser */

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

//Styles
import styles from '../sass/styles.scss';
import stylesCss from '../css/style.css';

const root = document.getElementById('root');

ReactDOM.render(<App />, root);
