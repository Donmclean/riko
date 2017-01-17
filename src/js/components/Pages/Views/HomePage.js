import React, { Component } from 'react';
import CounterClicker from '../../Shared/CounterClicker';
import PostSelector from '../../Shared/PostsSelector';
import PostsTable from '../../Shared/PostsTable';

class HomePage extends Component {
    constructor(props) {
        super(props);
        console.log('this.props: ', this.props);
    }

    render() {
        //This component has no state
        return (
            <div id="page-wrapper">
                <div className="container-fluid">
                    <h2 className="hello-world">
                        <span className="hello-world__rotate">Rix!</span>
                    </h2>
                    <div className="sync-section">
                        <CounterClicker />
                    </div>
                    <hr/>
                    <div className="async-section">
                        <PostSelector />
                        <PostsTable />
                    </div>
                </div>
            </div>
        );
    }
}

//Notice how dummy components like this one don't need be connected.
HomePage.propTypes = {};
export default HomePage;

// const mapStateToProps = (state) => {
//     return {state};
// };

// export default connect(mapStateToProps)(HomePage);