import ProgressBar from 'react-toolbox/lib/progress_bar';
import {FlexBox, FlexItem} from './Flex';
import {Button, IconButton} from 'react-toolbox/lib/button';
import Chip from 'react-toolbox/lib/chip';
import Avatar from 'react-toolbox/lib/avatar';
import styles from '../../../less/common.less';
import Tooltip from 'react-toolbox/lib/tooltip';

const TooltipButton = Tooltip(IconButton);

import React, {Component} from 'react';

class DataFetcher extends Component {

  fetchData() { }

  handleRetry() {
    this.fetchData();
  }

  handleRefresh() {
    this.fetchData();
  }

  handleLoadMore() {
    this.fetchData(this.props.data[this.props.data.length - 1]);
  }

  render() {
    const {error, loading} = this.props;
    return (
      <div>
        <FlexBox className={styles.subHeader}>
          <span style={{flex: 1}}>{this.title}</span>
          {loading ? <ProgressBar multicolor className={styles.refreshing} type="circular" mode="indeterminate" /> : null}
          <TooltipButton tooltip="刷新" tooltipPosition="left" onMouseUp={this.handleRefresh.bind(this)} inverse icon='refresh' />
        </FlexBox>
        {error ? (
          <FlexBox style={{ padding: '10px 0', textAlign: 'center' }} flexDirection="column">
            <div>
              <FlexItem>
                <Chip>
                  <Avatar style={{ backgroundColor: 'deepskyblue' }} icon="sentiment_dissatisfied" />
                  <span>{error}.Please retry</span>
                </Chip>
              </FlexItem>
              <FlexItem style={{ margin: '20px 0' }}><Button accent floating icon="refresh" onMouseUp={this.handleRefresh.bind(this) } /></FlexItem>
            </div>
          </FlexBox>
        ) : (this.renderContent ? this.renderContent() : null)}
      </div>
    );
  }
}

export default DataFetcher;