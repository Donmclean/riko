import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import getActions from '../actions/_index';

export class App extends Component {

    createChildren() {
        if(this.props.children) {
            return React.cloneElement(this.props.children, {
                /*Global Props go here*/
                actions: getActions(this.props.dispatch)
            });
        }

        return {};
    }

    render() {
        return (
            <div id="wrapper">
                {this.createChildren()}
            </div>
        );
    }
}

export default connect()(App);
