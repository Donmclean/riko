import React from 'react';
import Menu from './Menu.jsx';
import image from '../../media/images/iko.jpg';
import video from '../../media/videos/test-vid.mp4';

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
                <img src={image} />
                <video width="320" height="240" controls autoPlay src={video} type="video/mp4" />
                <Menu/>
                <button onClick={this.log.bind(this)} className="increment box">RIKO</button>
            </div>
        );
    }
}
