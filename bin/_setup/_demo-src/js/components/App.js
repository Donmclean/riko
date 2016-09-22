import React from 'react';
import Menu from './Menu.jsx';
const logit = require('../../vendor/logit');

//Assets
import image from '../../media/images/riko-favicon.png';
import imagePNG from '../../media/images/test.png';
import imageSVG from '../../media/images/arrow-tip.svg';
import video from '../../media/videos/test-vid.mp4';
import file from '../../media/files/test.pdf';

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
        return 'return from log function located in App Component!';
    }
    render() {
        logit();
        return (
            <div>
                <h2 className="hello-world">
                    <span className={this.state.animation}>Hello World!</span>
                </h2>
                <img src={image} />
                <video width="320" height="240" controls autoPlay src={video} type="video/mp4" />
                <Menu/>
                <h5>LESS</h5>
                <button onClick={this.log.bind(this)} className="increment box">RIKO</button>
            </div>
        );
    }
}
