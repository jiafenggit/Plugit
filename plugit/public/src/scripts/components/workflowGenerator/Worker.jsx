import React, {Component} from 'react';
import {Card, CardText, CardActions} from 'react-toolbox/lib/card';
import {Button} from 'react-toolbox/lib/button';
import {FlexBox, FlexItem} from '../common/Flex';
import Checkbox from 'react-toolbox/lib/checkbox';
import AceEditor from 'react-ace';
import {removeWorker, editWorker} from '../../actions/workflowGenerator';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

export default class Worker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showRemoveConfirm: false
    };
  }

  _handleRemoveWorkerConfirm() {
    this.setState({showRemoveConfirm: true});
  }

  _hideRemoveWorkerConfirm() {
    this.setState({showRemoveConfirm: false});
  }

  _handleRemoveWorker() {
    this.props.dispatch(removeWorker(this.props.workflowName, this.props.index));
    this._hideRemoveWorkerConfirm();
  }
  
  _handleEditWorker (worker) {
    const {index, workflowName} = this.props;
    this.props.dispatch(editWorker(workflowName, index, worker));
  }

  render() {
    const {worker, index, workflowName} = this.props;
    return (
      <Card raised style={{margin: '10px 0'}}>
        <Dialog
          active={this.state.showRemoveConfirm}
          actions={[
            {label: '确定', accent: true, onClick: this._handleRemoveWorker.bind(this)},
            {label: '取消', onClick: this._hideRemoveWorkerConfirm.bind(this)}
          ]}
          onOverlayClick={this._hideRemoveWorkerConfirm.bind(this)}
          type="small"
        >
          <p>确定要删除工作吗?该操作是不可撤销的!</p>
        </Dialog>
        <CardText>
          <FlexBox>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <Input
                label="母口名称"
                value={worker.receptacle}
                onChange={receptacle => this._handleEditWorker({receptacle})}
              />
            </FlexItem>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <Input
                label="组件类型"
                value={worker.type}
                onChange={type => this._handleEditWorker({type})}
              />
            </FlexItem>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <Input
                label="操作方法"
                value={worker.operation}
                onChange={operation => this._handleEditWorker({operation})}
              />
            </FlexItem>
            <FlexItem flex="1">
              <Input
                label="校验码"
                value={worker.workChecksum}
                onChange={workChecksum => this._handleEditWorker({workChecksum})}
              />
            </FlexItem>
          </FlexBox>
          <FlexBox>
            <FlexItem flex="1">
              <Input
                label="母口描述"
                value={worker.description}
                onChange={type => this._handleEditWorker({type})}
              />
            </FlexItem>
          </FlexBox>
          <FlexBox style={{marginBottom: '1.6rem'}}>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <p style={{padding: '5px 0'}}>ID绑定器</p>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name={`ace_editor_${workflowName}_${index}_idBinder`}
                height="200px"
                width="auto"
                fontSize={16}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                editorProps={{$blockScrolling: true}}
                value={worker.idBinder}
                onChange={idBinder => this._handleEditWorker({idBinder})}
              />
            </FlexItem>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <p style={{padding: '5px 0'}}>Query绑定器</p>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name={`ace_editor_${workflowName}_${index}_queryBinder`}
                height="200px"
                width="auto"
                fontSize={16}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                editorProps={{$blockScrolling: true}}
                value={worker.queryBinder}
                onChange={queryBinder => this._handleEditWorker({queryBinder})}
              />
            </FlexItem>
            <FlexItem flex="1">
              <p style={{padding: '5px 0'}}>参数映射器</p>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name={`ace_editor_${workflowName}_${index}_paramsMapper`}
                height="200px"
                width="auto"
                fontSize={16}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                editorProps={{$blockScrolling: true}}
                value={worker.paramsMapper}
                onChange={paramsMapper => this._handleEditWorker({paramsMapper})}
              />
            </FlexItem>
          </FlexBox>
          <FlexBox>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <p style={{padding: '5px 0'}}>数据打包器</p>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name={`ace_editor_${workflowName}_${index}_packager`}
                height="200px"
                width="auto"
                fontSize={16}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                editorProps={{$blockScrolling: true}}
                value={worker.packager}
                onChange={packager => this._handleEditWorker({packager})}
              />
            </FlexItem>
            <FlexItem flex="1" style={{marginRight: '1.6rem'}}>
              <p style={{padding: '5px 0'}}>指令分发器</p>
              <AceEditor
                mode="javascript"
                theme="monokai"
                name={`ace_editor_${workflowName}_${index}_dispatcher`}
                height="200px"
                width="auto"
                fontSize={16}
                enableBasicAutocompletion
                enableLiveAutocompletion
                tabSize={2}
                editorProps={{$blockScrolling: true}}
                value={worker.dispatcher}
                onChange={dispatcher => this._handleEditWorker({dispatcher})}
              />
            </FlexItem>
            <FlexItem flex="1" alignSelf="center">
              <Checkbox checked={worker.danger} onChange={danger => this._handleEditWorker({danger})} label="是否危险操作(若为写操作则必须设定为危险操作)"/>
            </FlexItem>
          </FlexBox>
        </CardText>
        <CardActions>
          <Button icon="clear" accent label="删除工作" onClick={this._handleRemoveWorkerConfirm.bind(this)}/>
        </CardActions>
      </Card>
    );
  }
}