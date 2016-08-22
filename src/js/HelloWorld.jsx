import React from 'react';
// import Menu from './Menu.jsx'

export default class HelloWorld extends React.Component {
  render() {
    // Play with it...
    const name = 'World!';

    return (
        <div>
          <h2 className="hello-world">
            <span className="hello-world__i">Hello, {name}</span>
          </h2>
          {/*<Menu/>*/}
        </div>

    );
  }
}
