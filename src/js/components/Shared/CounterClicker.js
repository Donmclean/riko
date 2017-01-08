"use strict";
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as types from '../../constants/actions/actionTypes';

//IMPORTANT!: Import actions to dispatch
import getActions from '../../actions/_index';

class CounterClicker extends Component {
    constructor(props) {
        super(props);
    }

    handleCounterClick(type) {
        const actions = getActions(this.props.dispatch);

        switch (type) {
            case types.INCREMENT: {
                actions.counterActionCreators.shouldIncrement();
                break;
            }
            case types.DECREMENT: {
                actions.counterActionCreators.decrement();
                break;
            }
            default: {
                break;
            }
        }
    }

    render() {
        const { state } = this.props;
        return (
            <div>
                <h4>Synchronous Actions</h4>

                <button className="inc" onClick={this.handleCounterClick.bind(this, types.INCREMENT)}>INCREMENT</button>
                <button className="dec" onClick={this.handleCounterClick.bind(this, types.DECREMENT)}>DECREMENT</button>

                <h1 className="counter-val">Counter Reducer State: {state.counterReducer.get('value')}</h1>
            </div>
        );
    }
}

CounterClicker.propTypes = {
    state: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(CounterClicker);