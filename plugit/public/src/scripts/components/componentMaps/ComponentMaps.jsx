import React, {Component} from 'react';
import DataFetcher from '../common/DataFetcher';
import {List, ListItem, ListSubHeader, ListDivider} from 'react-toolbox/lib/list';
import styles from '../../../less/common.less';
import Chip from 'react-toolbox/lib/chip';
import {fetchComponentMaps, componentMapsSelectReceptacle} from '../../actions/componentMaps';

export default class ComponentMaps extends DataFetcher {

  constructor(props) {
    super(props);
    this.title = '组件映射';
  }


  fetchData() {
    if (this.props.activeGroup) this.props.dispatch(fetchComponentMaps(this.props.activeGroup));
  }

  componentDidUpdate(prevProps, prevState) {
    const {error, loading} = this.props;
    if (error, loading) return;
    if (this.props.activeGroup !== prevProps.activeGroup) this.fetchData();
  }

  renderContent() {
    const {data, activeIndex} = this.props;
    return (
      <List selectable ripple>
        {
          Object.keys(data).map((workflow) => {
            const items = data[workflow];
            return [
              <ListSubHeader caption={`工作流: ${workflow}`}/>,
              ...items.map((componentMap, index) => {
                const i = [workflow, index].join('/');
                return (
                  <ListItem
                    className={i === activeIndex && styles.active || ''}
                    onClick={_ => this.props.dispatch(componentMapsSelectReceptacle(i, componentMap)) }
                    key={index}
                    caption={componentMap.receptacle}
                    legend={componentMap.description}
                    rightActions={[
                      <p key='type'>组件类型: <span>{componentMap.type}</span></p>,
                      <Chip key='name' style={{backgroundColor: '#ff4081', color: '#fff'}} className={styles.chipInList}>{componentMap.name}</Chip>
                    ]}
                  />
                );
              }),
              <ListDivider />
            ];
          })

        }
      </List>
    );
  }
}

