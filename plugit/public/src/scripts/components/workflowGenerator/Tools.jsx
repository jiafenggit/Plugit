/**
 * Created by miserylee on 16/8/20.
 */
import React, {Component} from 'react';
import Dialog from 'react-toolbox/lib/dialog';
import {IconButton} from 'react-toolbox/lib/button';
import AceEditor from 'react-ace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import {
  exportData,
  toggleExportBox
} from '../../actions/workflowGenerator';
import {saveAs} from 'file-saver';

export default class Tools extends Component {

  _handleExportData() {
    const {
      workflowGenerator_classNameReducer,
      workflowGenerator_dependenceReducer,
      workflowGenerator_workflowReducer
    } = this.props;
    this.props.dispatch(exportData({
      className: workflowGenerator_classNameReducer.className,
      dependencies: workflowGenerator_dependenceReducer.dependencies,
      workflow: workflowGenerator_workflowReducer.workflow
    }));
  }

  _handleToggleExportBox () {
    this.props.dispatch(toggleExportBox());
  }

  _handleSaveAsFile() {
    const {data} = this.props.workflowGenerator_toolsReducer;
    const {className} = this.props.workflowGenerator_classNameReducer;
    const blob = new Blob([data], {type: 'application/json;charset=utf-8'});
    saveAs(blob, `${className}.js`);
  }

  render() {
    const {workflowGenerator_toolsReducer} = this.props;
    return (
      <div>
        <IconButton icon="archive" onClick={this._handleExportData.bind(this)}/>
        <Dialog
          active={workflowGenerator_toolsReducer.showExportBox}
          actions={[
            {label: '存为文件', primary: true, onClick: _ => this._handleSaveAsFile()},
            {label: '关闭', onClick: _ => this._handleToggleExportBox()}
          ]}
          onOverlayClick={_ => this._handleToggleExportBox()}
          type="large"
        >
          <AceEditor
            mode="javascript"
            theme="monokai"
            name={`ace_editor_export`}
            width="auto"
            height={`${window.innerHeight * 0.8}px`}
            fontSize={16}
            tabSize={2}
            editorProps={{$blockScrolling: true}}
            value={workflowGenerator_toolsReducer.data}
            readOnly
          />
        </Dialog>
      </div>
    );
  }
}