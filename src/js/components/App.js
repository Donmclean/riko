import React from 'react';
import Menu from './Menu.jsx';

export default class App extends React.Component {
    constructor () {
        super();
        this.state = {
            animation: 'hello-world__rotate',
            isAnimating: true
        };
    }

    log() {
        if(this.state.isAnimating) {
            this.setState({ animation: '', isAnimating: false });
        } else {
            this.setState({ animation: 'hello-world__rotate', isAnimating: true });
        }
        console.log('this.state', this.state);
    }
    render() {
        return (
            <div>
                <h2 className="hello-world">
                    <span className={this.state.animation}>Hello World!</span>
                </h2>
                <Menu/>
                <button onClick={this.log.bind(this)} className="increment box">RIKO</button>
            </div>
        );
    }
}
