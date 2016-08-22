import React from 'react';
import styles from '../../css/App.css';
import Menu from './Menu';

class App extends React.Component {
  render() {
    return (
      <div>
          <h2 className="hello-world">
              <span className="hello-world__i">Hello, World</span>
          </h2>
        <Menu/>
        <button
          className={styles.increment}
        >
          +1
        </button>
      </div>
    );
  }
}

export default App;
