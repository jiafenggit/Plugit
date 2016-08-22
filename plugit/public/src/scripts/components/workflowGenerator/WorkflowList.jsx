import React from 'react';
import {List, ListItem, ListSubHeader, ListDivider} from 'react-toolbox/lib/list';
import Dialog from 'react-toolbox/lib/dialog';
import {MatchInputWithSubmitAndDescription} from '../common/MatchInput';
import {
  toggleAddWorkflowBox,
  addWorkflow,
  checkWorkflowNameExists,
  removeWorkflow,
  selectWorkflow
} from '../../actions/workflowGenerator';
import {IconButton} from 'react-toolbox/lib/button';
import styles from '../../../less/common.less';
import ListWithStickHeader from '../common/ListWithStickHeader';

export default class WorkflowList extends ListWithStickHeader {

  constructor(props) {
    super(props);
    this.state = {
      showRemoveWorkflowConfirm: false,
      workflowWaitForRemove: null
    };
    this.title = '工作流';
  }

  _handleToggleAddWorkflowBox() {
    this.props.dispatch(toggleAddWorkflowBox());
  }

  _handleAddWorkflow(value) {
    this.props.dispatch(addWorkflow(value));
  }

  _handleChange(value) {
    this.props.dispatch(checkWorkflowNameExists(value));
  }

  _handleRemoveWorkflow(name) {
    this.setState({
      showRemoveWorkflowConfirm: true,
      workflowWaitForRemove: name
    });
  }

  _hideRemoveWorkflowConfirm() {
    this.setState({showRemoveWorkflowConfirm: false});
  }

  _handleRemoveWorkflowConfirm() {
    this.props.dispatch(removeWorkflow(this.state.workflowWaitForRemove));
    this._hideRemoveWorkflowConfirm();
  }

  _handleSelectWorkflow(name) {
    this.props.dispatch(selectWorkflow(name));
  }
  
  renderContent () {
    const {workflow} = this.props;
    return (
      <List selectable ripple>
        <Dialog
          active={this.props.showAddWorkflowBox}
          onOverlayClick={this._handleToggleAddWorkflowBox.bind(this)}
          actions={[{label: '取消', onClick: this._handleToggleAddWorkflowBox.bind(this)}]}
        >
          <MatchInputWithSubmitAndDescription
            description="不能用数字开头,空格将会用下划线替换"
            type="text"
            label="工作流名"
            error={this.props.error}
            onChange={this._handleChange.bind(this)}
            onSubmit={this._handleAddWorkflow.bind(this)}
            match={/^[^0-9\s][\S]*$/}
          />
        </Dialog>
        <Dialog active={this.state.showRemoveWorkflowConfirm} actions={[
          {label: '确认', accent: true, onClick: this._handleRemoveWorkflowConfirm.bind(this)},
          {label: '取消', onClick: this._hideRemoveWorkflowConfirm.bind(this)}
        ]} onOverlayClick={this._hideRemoveWorkflowConfirm.bind(this)}>
          <p>确定删除工作流[{this.state.workflowWaitForRemove}]吗?所有工作流下的工作都会被删除!该操作是不可撤销的!</p>
        </Dialog>
        {Object.keys(workflow).map((key, index) => {
          return (
            <ListItem
              className={styles.wordBreak}
              onClick={_ => this._handleSelectWorkflow(key)}
              className={key === this.props.selectedWorkflow && styles.active || ''} caption={key}
              key={index}
              rightActions={[
                <IconButton key="remove" icon="clear" onClick={_ => this._handleRemoveWorkflow(key)} />
              ]}
            />
          );
        })}
        <ListDivider />
        <ListItem leftIcon="add" caption="添加工作流" onClick={this._handleToggleAddWorkflowBox.bind(this)}/>
      </List>
    );
  }

}