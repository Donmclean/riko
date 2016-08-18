import React from 'react';
import ReactDOM from 'react-dom';
import Menu from './components/Menu';
import Sample from './components/Sample';

// Stylesheets
import stylesheetSASS from '../sass/styles.scss';
import stylesheetCSS from '../css/custom-css.css';

class Root extends React.Component {
    render() {
        return (
            <div>
                <h1>Hello World!</h1>
                <p>from: RIKO</p>
                <h3>from: RIKO</h3>
                <div className="test-autoprefixer"></div>
                <Menu/>
                <Sample/>
            </div>

        );
    }
}

const root = document.getElementById('root');
ReactDOM.render(<Root />, root);