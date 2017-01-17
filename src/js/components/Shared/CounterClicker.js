"use strict";
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//IMPORTANT!: Import actions to dispatch
import getActions from '../../actions/_index';

class CounterClicker extends Component {
    constructor(props) {
        super(props);
        //Get all actions
        this.actions = getActions(this.props.dispatch);
    }

    render() {
        const { state } = this.props;
        return (
            <div>
                <h4>Synchronous Actions</h4>

                <button className="inc" onClick={this.actions.counterActionCreators.shouldIncrement}>INCREMENT</button>
                <button className="dec" onClick={this.actions.counterActionCreators.decrement}>DECREMENT</button>

                <h1 className="counter-val">Counter Reducer State: {state.counterReducer.get('value')}</h1>
            </div>
        );
    }
}

CounterClicker.propTypes = {
    state: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(CounterClicker);