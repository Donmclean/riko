// import React from 'react';
// import ReactDOM from 'react-dom';

const React = require('react');
const ReactDOM = require('react-dom');

class Root extends React.Component {
    render() {
        return (
            <h1>Hello World!</h1>
        );
    }
}

// console.log("?");

const root = document.getElementById('root');
ReactDOM.render(<Root />, root);