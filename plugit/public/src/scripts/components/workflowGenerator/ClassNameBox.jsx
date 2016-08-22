import React, {Component} from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import {Button} from 'react-toolbox/lib/button';
import {MatchInputWithSubmitAndDescription} from '../common/MatchInput';
import {editClassName, toggleClassNameBox} from '../../actions/workflowGenerator';
import {FlexBox} from '../common/Flex';

export default class ClassNameBox extends Component {

  _handleClassNameEdited (value) {
    this.props.dispatch(editClassName(value));
  }

  _handleToggleBox () {
    this.props.dispatch(toggleClassNameBox());
  }
  
  render() {
    return (
      <FlexBox>
        <Dialog
          active={this.props.show}
          onOverlayClick={this._handleToggleBox.bind(this)}
          actions={[{label: '取消', onClick: this._handleToggleBox.bind(this)}]}
        >
          <MatchInputWithSubmitAndDescription
            description="导出的类名,首位必须以大写字母,以驼峰法命名"
            onSubmit={value => this._handleClassNameEdited(value)}
            type="text"
            label="类名"
            value={this.props.className}
            match={/^[A-Z][a-zA-Z0-9_]*$/}
          />
        </Dialog>
        <Button style={{flex: 1, borderRadius: 0}} raised onClick={this._handleToggleBox.bind(this)} label={`类名(点击修改): ${this.props.className}`} />
      </FlexBox>
    );
  }

}