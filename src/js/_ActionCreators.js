import { forEach } from 'lodash';
import { bindActionCreators } from 'redux';

//import All Action Creators
import * as counterActionCreators from './components/Shared/CounterClicker/counterActionCreators';
import * as postSelectorActionCreators from './components/Shared/PostSelector/postSelectorActionCreators';

//Then Add Action Creators here
const actionCreators = {
    counterActionCreators,
    postSelectorActionCreators
};

//requires the 'dispatch' value from the 'connected' components 'this.props'
const getBoundedActions = (dispatch) => {
    const boundActionCreators = {};
    forEach(actionCreators, (actionCreator, key) => {
        boundActionCreators[key] = bindActionCreators(actionCreator, dispatch);
    });
    return boundActionCreators;
};

export default getBoundedActions;