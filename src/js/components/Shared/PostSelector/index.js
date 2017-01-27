import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//IMPORTANT!: Import actions to dispatch
import getActions from '../../../_ActionCreators';

//Import Styled Components
import { PostSelect, PostLabel, PostInput } from './postSelectorStyles';

class PostSelector extends Component {
    constructor(props) {
        super(props);
        this.actions = getActions(this.props.dispatch);
    }

    handlePostNumberSelect(event) {
        const postNumber = Number(event.target.value.replace(/\D/g, ''));

        this.actions.postSelectorActionCreators.updatePostNumber(postNumber);
        this.actions.postSelectorActionCreators.fetchPosts(postNumber);
    }

    render() {
        //Notice how state is destructured and applied
        const { state } = this.props;
        return (
            <div>
                <h4>Asynchronous Actions</h4>
                <PostInput>
                    <PostLabel>Select Post Number To Fetch</PostLabel>
                    <PostSelect onChange={this.handlePostNumberSelect.bind(this)} value={state.postSelectorReducer.get('postNumber')}>
                        <option disabled="true" defaultValue={0}>{0}</option>
                        {/*GENERATES 100 <option> elements with values of 1 to 100*/}
                        {Array.from(new Array(100).keys()).map((number) => <option key={number + 1} value={number + 1}>{number + 1}</option>)}
                    </PostSelect>
                </PostInput>
            </div>
        );
    }
}

PostSelector.propTypes = {
    state: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
};

//'state' gets applied to components' props here via 'connect'.
const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(PostSelector);