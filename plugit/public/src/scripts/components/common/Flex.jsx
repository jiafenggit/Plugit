import React, {Component} from 'react';

export class FlexBox extends Component {
  render() {
    const {inline, flexDirection, flexWrap, justifyContent, alignItems, alignContent, children, style = {}, className} = this.props;
    return (
      <div
        style={Object.assign({ display: inline ? 'inline-flex': 'flex', flexDirection, flexWrap, justifyContent, alignContent, alignItems }, style) }
        className={className}>
        {children}
      </div>
    );
  }
}

export class FlexItem extends Component {
  render() {
    const {order, alignSelf, flex, children, style = {}, className} = this.props;
    return (
      <div style={Object.assign({ order, flex, alignSelf}, style) } className={className}>
        {children}
      </div>
    );
  }
}
