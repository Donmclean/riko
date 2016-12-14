import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as types from '../../../constants/actions/actionTypes';
import Rx from 'rx';


class HomePage extends Component {
    constructor(props) {
        super(props);
        const { dispatch, state, actions } = this.props;
        this.actions = actions;
        console.log('this.props: ', this.props);
        console.log('Rx: ', Rx);

    }

    componentDidMount() {
        // const source = Rx.Observable.fromEvent(this.refs.c1, 'click').debounce(5000);
        // console.log('source: ', source);
        // console.log('this.refs: ', this.refs);
        //
        // const subscription = source.subscribe(
        //     (event) => {
        //         console.log('Next: Clicked!', event);
        //     },
        //     (err) => {
        //         console.log('Error: %s', err);
        //     },
        //     () => {
        //         console.log('Completed');
        //     });

        /* Using a disposable */
        const source = Rx.Observable.fromEventPattern(this.handleCounterClick);

        const subscription = source.subscribe(
            (x) => {
                console.log('Next: ' + x);
            },
            (err) => {
                console.log('Error: ' + err);
            },
            () => {
                console.log('Completed');
            });

        console.log('subscription: ', subscription);
    }

    handleCounterClick(type) {

        switch (type) {
            case types.INCREMENT: {
                this.actions.counterActionCreators.increment();
                break;
            }
            case types.DECREMENT: {
                this.actions.counterActionCreators.decrement();
                break;
            }
            default: {
                break;
            }
        }
    }

    handlePostNumberSelect(event) {
        const postNumber = Number(event.target.value.replace(/\D/g, ''));
        console.log('postNumber: ', postNumber);

        this.actions.asyncActionCreators.updateInputValue(postNumber);
        this.actions.asyncActionCreators.doGetPosts(postNumber);
    }

    render() {
        const { state } = this.props;
        console.info("this.props: ", this.props);
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <h2 className="hello-world">
                        <span className="hello-world__rotate">Rix!</span>
                    </h2>
                    <div>
                        <h4>Synchronous Actions</h4>
                        <button ref="c1" onClick={this.handleCounterClick.bind(this, types.INCREMENT)}>INCREMENT</button>
                        <button ref="c2" onClick={this.handleCounterClick.bind(this, types.DECREMENT)}>DECREMENT</button>

                        <h1>Counter Reducer State: {state.counterReducer}</h1>
                    </div>
                    <hr/>
                    <div className="async-section">
                        <h4>Asynchronous Actions</h4>
                        <div className="async-input">
                            <label>Select Post Number To Fetch</label>
                            <select onChange={this.handlePostNumberSelect.bind(this)} value={state.asyncReducer.postNumber}>
                                <option disabled="true" defaultValue={0}>{0}</option>
                                {Array.from(new Array(100).keys()).map((number) => <option key={number + 1} value={number + 1}>{number + 1}</option>)}
                            </select>
                        </div>

                        <h1>Async Reducer State (Posts)</h1>
                        <table className="async-table">
                            <thead>
                                <tr>
                                    <th className="async-table-id">ID</th>
                                    <th className="async-table-title">TITLE</th>
                                    <th className="async-table-body">BODY</th>
                                </tr>
                            </thead>
                            {(() => {
                                if(state.asyncReducer.postNumber === 0) {
                                    return null;
                                } else {
                                    return (
                                        <tbody>
                                            <tr>
                                                <td className="async-table-id">{state.asyncReducer.id}</td>
                                                <td className="async-table-title">{state.asyncReducer.title}</td>
                                                <td className="async-table-body">{state.asyncReducer.body}</td>
                                            </tr>
                                        </tbody>
                                    );
                                }
                            })()}
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {
    actions: PropTypes.object.isRequired,
    state: PropTypes.object.isRequired
};

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(HomePage);