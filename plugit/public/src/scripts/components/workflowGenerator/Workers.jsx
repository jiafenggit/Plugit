import ListWithStickHeader from '../common/ListWithStickHeader';
import React from 'react';
import Worker from './Worker';
import {List, ListItem} from 'react-toolbox/lib/list';
import {Button} from 'react-toolbox/lib/button';
import {
  addWorker
} from '../../actions/workflowGenerator';

export default class Workers extends ListWithStickHeader {
  constructor(props) {
    super(props);
    this.title = '工作列表';
  }

  _renderAddWorker(index) {
    return (
      <Button key={`addWorker_${index}`} onClick={_ => this._handleAddWorker(index)} flat ripple primary icon="add" style={{width: '100%'}}>添加工作</Button>
    );
  }

  _handleAddWorker(index) {
    this.props.dispatch(addWorker(this.props.workflowName, index));
  }

  renderContent() {
    const {workers} = this.props; 
    return (
      <List>
        <ListItem itemContent={
          <div style={{width: '100%'}}>
            {this._renderAddWorker(0)}
            {workers && workers.map((worker, index) => {
              return [
                <Worker dispatch={this.props.dispatch} workflowName={this.props.workflowName} worker={worker} index={index} key={index} />,
                this._renderAddWorker(index + 1)
              ];
            })}
          </div>
        }/>
      </List>
    );
  }
}