import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

export default class NotFoundPage extends Component {
    render() {
        return (
            <section id="wrapper" className="error-page">
                <div className="error-body text-center">
                    <h1>404</h1>
                </div>
            </section>
        );
    }
}