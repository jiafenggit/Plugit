import React, {Component} from 'react';
import Navigator from './Navigator';

export default class App extends Component {

  render() {
    return (
      <div>
        <Navigator />
        <div style={{ paddingTop: '6.4rem', position: 'fixed', width: '100%', height: '100%'}}>
          {this.props.children}
        </div>
      </div>
    );
  }
}