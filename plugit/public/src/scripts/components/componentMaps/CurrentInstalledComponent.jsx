/**
 * Created by miserylee on 16/8/10.
 */
import React, {Component} from 'react';

import DataFetcher from '../common/DataFetcher';
import {fetchComponent} from '../../actions/component';
import ComponentInfo from './ComponentInfo';

class CurrentInstalledComponent extends DataFetcher {
  constructor(props) {
    super(props);
    this.title = '当前安装组件';
  }

  componentDidUpdate(prevProps, prevState) {
    const {activeIndex, error, loading, componentMap} = this.props;
    if (!componentMap || error || loading) return;
    if (!prevProps.activeIndex || prevProps.activeIndex !== activeIndex || componentMap.name !== prevProps.componentMap.name) {
      this.fetchData();
    }
  }

  fetchData() {
    if(!this.props.componentMap) return;
    const {type, name} = this.props.componentMap;
    this.props.dispatch(fetchComponent(type, name));
  }

  renderContent() {
    return (
      <ComponentInfo {...this.props} settingable={true}/>
    );
  }


}

export default CurrentInstalledComponent;