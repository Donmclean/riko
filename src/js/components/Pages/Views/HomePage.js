import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';

class HomePage extends Component {
    componentWillMount() {
        const { dispatch, state, actions } = this.props;
        console.log('this.props: ', this.props);

        // return actions.fetchUserProfile(auth);
    }

    handleCounterClick(type) {
        const { actions } = this.props;

        switch (type) {
            case 'increment': {
                actions.counterActionCreators.increment();
                break;
            }
            case 'decrement': {
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
        console.info("this.props: ", this.props);
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <h2 className="hello-world">
                        <span className="hello-world__rotate">Rix!</span>
                    </h2>
                    <button onClick={this.handleCounterClick.bind(this, 'increment')}>INCREMENT</button>
                    <button onClick={this.handleCounterClick.bind(this, 'decrement')}>DECREMENT</button>
                    <h1>Counter Reducer State: {state.counterReducer}</h1>
                </div>
            </div>
        );
    }
}

HomePage.propTypes = {
    //images: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(HomePage);