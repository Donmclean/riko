import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

const root = document.getElementById('root');

const render = (Component) => {
    ReactDOM.render(
        <AppContainer>
            <Component/>
        </AppContainer>,
        root
    );
};

render(App);

// Hot Module Replacement API
// ONLY VALID FOR process.env.NODE_ENV = 'development'
if (module.hot) {
    module.hot.accept('./components/App', () => {
        render(App)
    });
}