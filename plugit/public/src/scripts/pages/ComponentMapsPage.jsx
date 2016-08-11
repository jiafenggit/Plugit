import React, {Component} from 'react';
import ComponentMapsContainer from '../containers/ComponentMapsContainer';
import ComponentMapsGroupsContainer from '../containers/ComponentMapsGroupsContainer';
import ComponentInfoContainer from '../containers/ComponentInfoContainer';
import ComponentsByTypeContainer from '../containers/ComponentsByTypeContainer';
import SplitView from '../components/common/SplitView';

export default class ComponentMapsPage extends Component {

  renderLeftView() {
    return (
      <SplitView rightView={<ComponentMapsContainer />} leftView={<ComponentMapsGroupsContainer />} leftFlex={0.3}/>
    );
  }

  renderRightView() {
    return (
      <div>
        <ComponentInfoContainer />
        <ComponentsByTypeContainer />
      </div>
    );
  }

  render() {
    return (
      <SplitView leftView={this.renderLeftView() } rightView={this.renderRightView()}/>
    );
  }
}

