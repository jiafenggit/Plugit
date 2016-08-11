import DataFetcher from '../common/DataFetcher';
import { List, ListItem, ListSubHeader, ListDivider } from 'react-toolbox/lib/list';
import {fetchComponentMapsGroups, componentMapsSelectGroup} from '../../actions/componentMapsGroups';
import styles from '../../../less/common.less';
import React, {Component} from 'react';

class ComponentMapsGroups extends DataFetcher {
  constructor(props) {
    super(props);
    this.title = '分组';
  }
  

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.props.dispatch(fetchComponentMapsGroups());
  }

  renderContent() {
    const {data, activeIndex} = this.props;
    return (
      <List selectable ripple>
        {data.map((componentMapsGroup, index) => {
          return (
            <ListItem key={index} className={index === activeIndex && styles.active || ''} onClick={_ => this.props.dispatch(componentMapsSelectGroup(index)) } caption={componentMapsGroup} />
          );
        }) }
      </List>
    );
  }
}

export default ComponentMapsGroups;