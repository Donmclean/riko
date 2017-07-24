import React from 'react';

//Styles
import './App.scss';

//Assets
import image from '../../media/images/riko-favicon.png';

export default class App extends React.Component {
    constructor () {
        super();
        this.state = {
            animation: 'hello-world__rotate',
            isAnimating: true
        };
    }

    action() {
        if(this.state.isAnimating) {
            this.setState({ animation: '', isAnimating: false });
        } else {
            this.setState({ animation: 'hello-world__rotate', isAnimating: true });
        }
    }
    render() {
        return (
            <div>
                <h2 className="hello-world">
                    <span className={this.state.animation}>Hello World!</span>
                </h2>
                <img src={image} />
                <button onClick={this.action.bind(this)} className="button">RIKO</button>
            </div>
        );
    }
}
