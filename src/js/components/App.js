import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';
import actionCreators from '../actions/_index';

export class App extends Component {
    extractAndBindActionCreators() {
        const boundActionCreators = {};
        _.forEach(actionCreators, (actionCreator, key) => {
            boundActionCreators[key] = bindActionCreators(actionCreator, this.props.dispatch);
        });
        console.log('boundActionCreators: ', boundActionCreators);
        return boundActionCreators;
    }

    createChildren() {
        if(this.props.children) {
            return React.cloneElement(this.props.children, {
                /*Global Props go here*/
                actions: this.extractAndBindActionCreators()
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
