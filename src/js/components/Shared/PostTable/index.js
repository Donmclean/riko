import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

//Import Styled Components
import { PostTableWrapper, Table, TableID, TableTitle, TableBody } from './postTableStyles';

class PostsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //Notice how state is destructured and applied
        const { state } = this.props;
        return (
            <PostTableWrapper>
                <h1>Async Reducer State (Posts)</h1>
                <Table>
                    <thead>
                        <tr>
                            <TableID>ID</TableID>
                            <TableTitle>TITLE</TableTitle>
                            <TableBody>BODY</TableBody>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <TableID>{state.postSelectorReducer.get('id')}</TableID>
                            <TableTitle>{state.postSelectorReducer.get('title')}</TableTitle>
                            <TableBody>{state.postSelectorReducer.get('body')}</TableBody>
                        </tr>
                    </tbody>
                </Table>
            </PostTableWrapper>
        );
    }
}

PostsTable.propTypes = {
    state: PropTypes.object.isRequired
};

//'state' gets applied to components' props here via 'connect'.
const mapStateToProps = (state) => ({state});

export default connect(mapStateToProps)(PostsTable);