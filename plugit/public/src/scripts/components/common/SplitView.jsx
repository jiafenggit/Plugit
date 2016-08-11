import {FlexBox, FlexItem} from './Flex';

import React, {Component} from 'react';

class SplitView extends Component {
  render() {
    const {leftView, rightView, leftFlex = 1} = this.props;
    return (
      <FlexBox style={{ height: '100%', overflow: 'hidden', position: 'relative' }}>
        <FlexItem flex={leftFlex} style={{boxShadow: '2px 0 4px rgba(0,0,0,.14)', zIndex: 1, height: '100%', overflow: 'auto'}}>{leftView}</FlexItem>
        <FlexItem flex={1} style={{height: '100%', overflow: 'auto', zIndex: 0}}>{rightView}</FlexItem>
      </FlexBox>
    );
  }
}

export default SplitView;