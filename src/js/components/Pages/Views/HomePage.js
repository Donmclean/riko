import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import * as types from '../../../constants/actions/actionTypes';
import Rx from 'rxjs/Rx';
import CounterClicker from '../../Shared/CounterClicker';
import { createObservable } from '../../../classes/RxObservableHOC';

class HomePage extends Component {
    constructor(props) {
        super(props);
        const { dispatch, state, actions } = this.props;
        this.actions = actions;
        console.log('this.props: ', this.props);

    }

    componentDidMount() {
        const { state } = this.props;

        //Setup Observables
        //TODO: Use Redux Observable
        // window.x = this.testfetchPostSubscription = createObservable(
        //     Rx.Observable.fromEvent(this.refs.testfetchPost, 'change')
        //         .takeWhile(() => this.testfetchPostSubscription.dispose)
        //         .pluck('target', 'value')
        //         .map(val => Number(val.replace(/\D/g, '')))
                // .doOnNext((val) => {this.updatePostNumber(val);})
                // .debounce(2000)
                // .doOnNext(this.handlePostNumberAsyncSelect.bind(this))
                // .takeUntil(Rx.Observable.timer(14000))
            // ,this.handlePostNumberAsyncSelect.bind(this) //Optional
        // );
    }

    updatePostNumber(postNumber) {
        this.actions.asyncActionCreators.updatePostNumber(postNumber);
    }

    handlePostNumberAsyncSelect(postNumber) {
        // const postNumber = Number(value.replace(/\D/g, ''));
        console.log('postNumber: ', postNumber);

        // this.actions.asyncActionCreators.updatePostNumber(postNumber);
        this.actions.asyncActionCreators.fetchPosts(postNumber);
    }

    handlePostNumberSelect(event) {
        const postNumber = Number(event.target.value.replace(/\D/g, ''));
        console.log('postNumber: ', postNumber);

        this.actions.asyncActionCreators.updatePostNumber(postNumber);
        this.actions.asyncActionCreators.fetchPosts(postNumber);
    }

    render() {
        const { state } = this.props;
        console.info("this.props: ", this.props);
        console.info("asyncReducer postNumber: ", state.asyncReducer.get('postNumber'));
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <h2 className="hello-world">
                        <span className="hello-world__rotate">Rix!</span>
                    </h2>
                    <CounterClicker {...this.props} />
                    <hr/>
                    <div className="async-section">
                        <div>
                            <h4>Asynchronous Actions</h4>
                            <div className="async-input">
                                <label>Select Post Number To Fetch</label>
                                <select onChange={this.handlePostNumberSelect.bind(this)} value={state.asyncReducer.get('postNumber')}>
                                    <option disabled="true" defaultValue={0}>{0}</option>
                                    {Array.from(new Array(100).keys()).map((number) => <option key={number + 1} value={number + 1}>{number + 1}</option>)}
                                </select>
                                {/*<select ref='testfetchPost' value={state.asyncReducer.get('postNumber')}>*/}
                                    {/*<option disabled="true" defaultValue={0}>{0}</option>*/}
                                    {/*{Array.from(new Array(100).keys()).map((number) => <option key={number + 1} value={number + 1}>{number + 1}</option>)}*/}
                                {/*</select>*/}
                            </div>
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
                            <tbody>
                                <tr>
                                    <td className="async-table-id">{state.asyncReducer.get('id')}</td>
                                    <td className="async-table-title">{state.asyncReducer.get('title')}</td>
                                    <td className="async-table-body">{state.asyncReducer.get('body')}</td>
                                </tr>
                            </tbody>
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