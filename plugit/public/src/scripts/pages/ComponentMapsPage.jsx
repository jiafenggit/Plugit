import React, {Component} from 'react';
import ComponentMapsContainer from '../containers/componentMaps/ComponentMapsContainer';
import ComponentMapsGroupsContainer from '../containers/componentMaps/ComponentMapsGroupsContainer';
import ComponentInfoContainer from '../containers/componentMaps/ComponentInfoContainer';
import ComponentsByTypeContainer from '../containers/componentMaps/ComponentsByTypeContainer';
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

