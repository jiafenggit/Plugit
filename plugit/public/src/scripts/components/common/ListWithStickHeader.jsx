import React, {Component} from 'react';
import SplitView from './SplitView';
import styles from '../../../less/common.less';
import {FlexBox} from './Flex';

export default class ListWithStickHeader extends Component {
  
  constructor(props) {
    super(props);
    this.headerHeight = '50px';
    this.title = 'Title';
  }
  
  renderHeader() {
    return (
      <FlexBox className={styles.subHeader} >
        <span>{this.title}</span>
      </FlexBox>
    );
  }
  
  renderContent () {
    return null;
  }
  
  render () {
    return (
      <SplitView
        vertical={true}
        topView={this.renderHeader()}
        bottomView={this.renderContent()}
        topFlex={null}
      />
    );
  }
}