import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class PostsTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        //Notice how state is destructured and applied
        const { state } = this.props;
        return (
            <div>
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
                            <td className="async-table-id">{state.postsSelectorReducer.get('id')}</td>
                            <td className="async-table-title">{state.postsSelectorReducer.get('title')}</td>
                            <td className="async-table-body">{state.postsSelectorReducer.get('body')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
}

PostsTable.propTypes = {
    state: PropTypes.object.isRequired
};

//'state' gets applied to components' props here via 'connect'.
const mapStateToProps = (state) => {
    return {state};
};

export default connect(mapStateToProps)(PostsTable);