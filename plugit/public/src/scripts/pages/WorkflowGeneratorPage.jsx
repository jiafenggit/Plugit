/**
 * Created by miserylee on 16/8/19.
 */
import React, {Component} from 'react';

import SplitView from '../components/common/SplitView';
import ClassNameBoxContainer from '../containers/workflowGenerator/ClassNameBoxContainer';
import WorkflowListContainer from '../containers/workflowGenerator/WorkflowListContainer';
import DependenciesContainer from '../containers/workflowGenerator/DependeciesContainer';
import WorkflowContainer from '../containers/workflowGenerator/WorkflowContianer';
import ToolsContainer from '../containers/workflowGenerator/ToolsContainer';
import {FlexBox, FlexItem} from '../components/common/Flex';

export default class ComponentRegistryPage extends Component {

  _renderDependencies() {
    return (
      <DependenciesContainer />
    );
  }

  _renderWorkflowList() {
    return (
      <WorkflowListContainer />
    );
  }

  _renderWorkerPanel() {
    return (
      <WorkflowContainer />
    );
  }

  _renderAside() {
    return (
      <SplitView vertical={true} topView={this._renderDependencies()} bottomView={this._renderWorkflowList()}
                 topFlex={null} topHeight="300px"/>
    );
  }

  _renderClassNameBox() {
    return (
      <FlexBox>
        <FlexItem flex="1">
          <ClassNameBoxContainer />
        </FlexItem>
        <ToolsContainer />
      </FlexBox>
    );
  }

  _renderMainPanel() {
    return (
      <SplitView
        leftView={this._renderAside()}
        rightView={this._renderWorkerPanel()}
        leftWidth="300px"
        leftFlex={null}
      />
    );
  }

  render() {
    return (
      <SplitView vertical={true} topView={this._renderClassNameBox()} bottomView={this._renderMainPanel()} topFlex={null} />
    );
  }
}