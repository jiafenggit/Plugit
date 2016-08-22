import {FlexBox, FlexItem} from './Flex';

import React, {Component} from 'react';

class SplitView extends Component {
  render() {
    const {leftView, rightView, leftFlex = 1, leftWidth = 'auto', rightFlex = 1, rightWidth = 'auto', vertical = false, topView, bottomView, topFlex = 1, bottomFlex = 1, topHeight = 'auto', bottomHeight = 'auto'} = this.props;

    return (
      <FlexBox flexDirection={vertical && 'column' || 'row'} style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        {vertical && [
          <FlexItem key="topView" flex={topFlex} style={{boxShadow: '2px 2px 4px rgba(0,0,0,.14)', zIndex: 1, width: '100%', overflow: 'auto', height: topHeight}}>{topView}</FlexItem>,
          <FlexItem key="bottomView" flex={bottomFlex} style={{width: '100%', overflow: 'auto', zIndex: 0, height: bottomHeight}}>{bottomView}</FlexItem>
        ] || [
          <FlexItem key="leftView" flex={leftFlex} style={{boxShadow: '2px 2px 4px rgba(0,0,0,.14)', zIndex: 1, height: '100%', overflow: 'auto', width: leftWidth}}>{leftView}</FlexItem>,
          <FlexItem key="rightView" flex={rightFlex} style={{height: '100%', overflow: 'auto', zIndex: 0, width: rightWidth}}>{rightView}</FlexItem>
        ]}
      </FlexBox>
    );
  }
}

export default SplitView;