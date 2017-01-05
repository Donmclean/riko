import { forEach } from 'lodash';
import { bindActionCreators } from 'redux';

//import All Action Creators
import * as counterActionCreators from './counterActionCreators';
import * as asyncActionCreators from './asyncActionCreators';

//Then Add Action Creators here
const actionCreators = {
    counterActionCreators,
    asyncActionCreators
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