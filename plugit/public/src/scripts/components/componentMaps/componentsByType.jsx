import React, {Component} from 'react';

import DataFetcher from '../common/DataFetcher';
import {fetchComponentsByType} from '../../actions/component';
import ComponentInfo from './ComponentInfo';

class ComponentsByType extends DataFetcher {
  constructor(props) {
    super(props);
    this.title = '可安装组件';
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.props.componentMap) return;
    const {type} = this.props.componentMap;
    const {error, loading} = this.props;
    if (error || loading) return;
    if(!prevProps.componentMap || type !== prevProps.componentMap.type) {
      this.fetchData();
    }
  }

  fetchData () {
    this.props.dispatch(fetchComponentsByType(this.props.componentMap.type));
  }

  renderContent () {
    const {data, ...others} = this.props;
    if(!data) return null;
    return (
      <div>{data.map((o, index) => {
        return (
          <ComponentInfo key={index} {...others} data={o} />
        );
      })}</div>
    );
  }
}

export default ComponentsByType;