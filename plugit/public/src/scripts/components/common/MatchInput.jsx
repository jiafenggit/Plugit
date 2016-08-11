import Input from 'react-toolbox/lib/input';
import {IconButton} from 'react-toolbox/lib/button';
import {FlexBox, FlexItem} from './Flex';
import styles from '../../../less/common.less';

import React, {Component} from 'react';

export class MatchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      value: props.value || ''
    };
    this._initValue = props.value;
    this._dirty = false;
  }

  componentWillUpdate(nextProps, nextState) {
    if(nextProps.value !== this._initValue) {
      this.setState({value: nextProps.value, error: null});
      this._initValue = nextProps.value;
      this._dirty = false;
    }
  }

  _handleChangeContent(value) {
    this._dirty = true;
    const regExp = new RegExp(this.props.match);
    if (!regExp.test(value)) {
      this.setState({value, error: `输入值不匹配正则表达式${regExp}`});
    } else {
      this.setState({value, error: null});
    }
  }

  _handleSubmit() {
    if (!this._dirty || this._initValue === this.state.value) return;
    this.props.onSubmit && this.props.onSubmit(this.state.value);
  }

  _handleBlur() {
    this._handleSubmit();
  }

  render() {
    const {label, disabled} = this.props;
    const {error, value} = this.state;
    return (
      <Input disabled={disabled} label={label} value={value} error={error || this.props.error}
             onBlur={this._handleBlur.bind(this)} onChange={this._handleChangeContent.bind(this) }/>
    );
  }
}

export class MatchInputWithSubmitAndDescription extends MatchInput {

  _handleKeyPress({key}) {
    if(key === 'Enter') this._handleSubmit();
  }

  render() {
    const {label, disabled, submitIcon = 'check', description} = this.props;
    const {error, value} = this.state;
    return (
      <FlexBox style={{width: '100%'}} flexDirection="column">
        <FlexBox alignItems="center">
          <Input className={styles.flex1} disabled={disabled} label={label} value={value}
                 onKeyPress={this._handleKeyPress.bind(this)}
                 error={error || this.props.error} onChange={this._handleChangeContent.bind(this) }/>
          <IconButton disabled={disabled} icon={submitIcon} onMouseUp={this._handleSubmit.bind(this)}/>
        </FlexBox>
        <FlexItem>
          <p className={styles.description}>{description}</p>
        </FlexItem>
      </FlexBox>
    );
  }
}