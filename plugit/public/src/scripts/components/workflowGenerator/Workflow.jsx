import React, {Component} from 'react';
import {MatchInputWithSubmitAndDescription} from '../common/MatchInput';
import {
  workflowChangeName,
  checkWorkflowNameExists,
  workflowToggleInjectTransaction
} from '../../actions/workflowGenerator';
import {List, ListItem} from 'react-toolbox/lib/list';
import Checkbox from 'react-toolbox/lib/checkbox';
import SplitView from '../common/SplitView';
import ListWithStickHeader from '../common/ListWithStickHeader';
import Workers from './Workers';

export default class Workflow extends ListWithStickHeader {

  constructor(props) {
    super(props);
    this.title = '工作流设置';
  }

  _handleWorkflowChangeName(value) {
    this.props.dispatch(workflowChangeName(this.props.selectedWorkflow, value));
  }

  _handleWorkflowNameChange(value) {
    this.props.dispatch(checkWorkflowNameExists(value));
  }

  _handleToggleInjectTransaction() {
    this.props.dispatch(workflowToggleInjectTransaction(this.props.selectedWorkflow));
  }

  _renderWorkflowEditBox () {
    const workflow = this.props.workflow[this.props.selectedWorkflow];
    return (
      <List>
        <ListItem>
          <MatchInputWithSubmitAndDescription
            label="工作流名称"
            value={this.props.selectedWorkflow}
            error={this.props.error}
            onChange={this._handleWorkflowNameChange.bind(this)}
            onSubmit={this._handleWorkflowChangeName.bind(this)}
            match={/^[^0-9\s][\S]*$/}
          />
          <Checkbox onChange={this._handleToggleInjectTransaction.bind(this)} checked={workflow.injectTransaction}
                    label="是否注入事务(如果有写操作则必须注入事务)"/>
        </ListItem>
      </List>
    );
  }

  _renderWorkerList () {
    const workflow = this.props.workflow[this.props.selectedWorkflow];
    return (
      <Workers dispatch={this.props.dispatch} workers={workflow.workers} workflowName={this.props.selectedWorkflow} />
    );
  }

  renderContent() {
    const workflow = this.props.workflow[this.props.selectedWorkflow];
    if (!workflow) return null;
    return (
      <SplitView vertical={true} topFlex={null} topView={this._renderWorkflowEditBox()} bottomView={this._renderWorkerList()} />
    );
  }
}