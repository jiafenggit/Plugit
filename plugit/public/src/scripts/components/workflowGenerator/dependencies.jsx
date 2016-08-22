import React, {Component} from 'react';
import {List, ListItem, ListSubHeader, ListDivider} from 'react-toolbox/lib/list';
import Dialog from 'react-toolbox/lib/dialog';
import {MatchInput} from '../common/MatchInput';
import {IconButton} from 'react-toolbox/lib/button';
import {
  toggleAddDependenceBox,
  addDependence,
  removeDependence,
  checkDependenceKeyExists
} from '../../actions/workflowGenerator';
import styles from '../../../less/common.less';
import ListWithStickHeader from '../common/ListWithStickHeader';

export default class Dependencies extends ListWithStickHeader {
  constructor(props) {
    super(props);
    this.state = {
      showRemoveDependenceConfirm: false,
      dependenceWaitForRemove: null,
      key: null,
      requirePath: null
    };
    this.title = '依赖项';
  }

  _handleToggleAddDependenceBox() {
    this.props.dispatch(toggleAddDependenceBox());
  }

  _handleAddDependence() {
    this.props.dispatch(addDependence(this.state.key, this.state.requirePath));
  }

  _handleRemoveDependence(key) {
    this.setState({
      showRemoveDependenceConfirm: true,
      dependenceWaitForRemove: key
    });
  }

  _handleRemoveDependenceConfirm() {
    this.props.dispatch(removeDependence(this.state.dependenceWaitForRemove));
    this._hideRemoveDependenceConfirm();
  }

  _hideRemoveDependenceConfirm() {
    this.setState({showRemoveDependenceConfirm: false});
  }

  _handleDependenceKeyChange(value) {
    this.props.dispatch(checkDependenceKeyExists(value));
    this.setState({key: value});
  }

  _handleDependencePathChange(value) {
    this.setState({requirePath: value});
  }

  renderContent() {
    return (
      <List>
        <Dialog
          active={this.props.showAddDependenceBox}
          onOverlayClick={this._handleToggleAddDependenceBox.bind(this)}
          actions={[
            {label: '确定', accent: true, onClick: this._handleAddDependence.bind(this)},
            {label: '取消', onClick: this._handleToggleAddDependenceBox.bind(this)}
          ]}
        >
          <MatchInput
            label="变量名"
            error={this.props.error}
            onChange={this._handleDependenceKeyChange.bind(this)}
            match={/^[^0-9\s][\S]*$/}
          />
          <MatchInput
            label="require路径"
            onChange={this._handleDependencePathChange.bind(this)}
            match={/^[\S]+$/}
          />
        </Dialog>
        <Dialog active={this.state.showRemoveDependenceConfirm} actions={[
          {label: '确认', primary: true, onClick: this._handleRemoveDependenceConfirm.bind(this)},
          {label: '取消', onClick: this._hideRemoveDependenceConfirm.bind(this)}
        ]} onOverlayClick={this._hideRemoveDependenceConfirm.bind(this)}>
          <p>确定删除依赖项[{this.state.dependenceWaitForRemove}]吗?</p>
        </Dialog>
        {Object.keys(this.props.dependencies).map((key, index) => {
          return (
            <ListItem
              className={styles.wordBreak}
              caption={key}
              legend={`require('${this.props.dependencies[key]}')`}
              key={index}
              rightActions={[
                <IconButton key="remove" icon="clear" onClick={_ => this._handleRemoveDependence(key)} />
              ]}
            />
          );
        })}
        <ListDivider />
        <ListItem leftIcon="add" caption="添加依赖项" onClick={this._handleToggleAddDependenceBox.bind(this)}/>
      </List>
    );
  }
}