import React, {Component} from 'react';
import AppBar from 'react-toolbox/lib/app_bar';
import Navigator from './Navigator';

export default class App extends Component {
  render() {
    return (
      <div>
        <AppBar fixed flat>
          <Navigator/>
        </AppBar>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}