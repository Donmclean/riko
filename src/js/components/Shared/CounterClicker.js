"use strict";
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as types from '../../constants/actions/actionTypes';
import Rx from 'rxjs/Rx';

import { createObservable } from '../../classes/RxObservableHOC';

class CounterClicker extends Component {
    constructor(props) {
        super(props);
    }

    handleCounterClick(type) {
        const { actions } = this.props;

        switch (type) {
            case types.INCREMENT: {
                actions.counterActionCreators.increment();
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

    componentDidMount() {
        //Setup Observables
        const testINCSubscription = createObservable(
            Rx.Observable.fromEvent(this.refs.testINC, 'click').debounce(2000),
            this.handleCounterClick.bind(this, types.INCREMENT)
        );

        const testDECSubscription = createObservable(
            Rx.Observable.fromEvent(this.refs.testDEC, 'click').debounce(2000),
            this.handleCounterClick.bind(this, types.DECREMENT)
        );
    }

    render() {
        const { state } = this.props;
        return (
            <div>
                <h4>Synchronous Actions</h4>

                {/*OLD WAY*/}
                <button onClick={this.handleCounterClick.bind(this, types.INCREMENT)}>INCREMENT</button>
                <button onClick={this.handleCounterClick.bind(this, types.DECREMENT)}>DECREMENT</button>

                {/*NEW WAY*/}
                <button ref='testINC'>Rx INCREMENT</button>
                <button ref='testDEC'>Rx DECREMENT</button>

                <h1>Counter Reducer State: {state.counterReducer}</h1>
            </div>
        );
    }
}

CounterClicker.propTypes = {
    actions: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(CounterClicker);