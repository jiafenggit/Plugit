import React, { Component } from 'react';
import AppContainer from '../containers/AppContainer';

export default class AppPage extends Component {
  render() {
    const {children, ...others} = this.props;
    return (
      <AppContainer {...others}>{children}</AppContainer>
    );
  }
}
