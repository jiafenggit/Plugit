import React, {Component} from 'react';
import {List, ListItem, ListSubHeader, ListDivider} from 'react-toolbox/lib/list';
import Chip from 'react-toolbox/lib/chip';
import styles from '../../../less/common.less';
import {MatchInputWithSubmitAndDescription} from '../common/MatchInput';
import {updateComponentMapSetting, changeComponent} from '../../actions/componentMaps';
import {IconButton} from 'react-toolbox/lib/button';
import Tooltip from 'react-toolbox/lib/tooltip';
import FontIcon from 'react-toolbox/lib/font_icon';
import Dialog from 'react-toolbox/lib/dialog';

const TooltipIconButton = Tooltip(IconButton);
const TooltipFontIcon = Tooltip(FontIcon);

class ComponentInfo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showInfo: false,
      showChangeComponentDialog: false
    };
  }

  _handleToggleInfo(e) {
    e.stopPropagation();
    this.setState({
      showInfo: !this.state.showInfo
    });
  }

  _handleInfoBoxMount(ref) {
    if (ref) this._infoBoxHeight = ref.scrollHeight;
  }

  _handleSettingUpdate(key, value) {
    const {group, workflow, receptacle} = this.props.componentMap;
    this.props.dispatch(updateComponentMapSetting(group, workflow, receptacle, key, value));
  }

  _handleChangeComponent(e) {
    e.stopPropagation();
    this.setState({
      showChangeComponentDialog: true
    });
  }

  _handleChangeComponentCancel () {
    this.setState({
      showChangeComponentDialog: false
    });
  }

  _handleChangeComponentConfirm () {
    const {group, workflow, receptacle} = this.props.componentMap;
    this.props.dispatch(changeComponent(group, workflow, receptacle, this.props.data.name));
    this.setState({
      showChangeComponentDialog: false
    });
  }

  render() {
    const {componentMap, data, updateSettingErrors, updatingSettings, settingable} = this.props;
    const {showInfo, showChangeComponentDialog} = this.state;
    if (!data) return null;
    const {settings, attributes, operations} = data;
    const installed = data.name === componentMap.name;
    return (
      <div>
        <Dialog
          active={showChangeComponentDialog}
          type="small"
          onEscKeyDown={this._handleChangeComponentCancel.bind(this)}
          onOverlayClick={this._handleChangeComponentCancel.bind(this)}
          actions={[
            {label: '确定', onClick: this._handleChangeComponentConfirm.bind(this)},
            {label: '取消', accent: true, onClick: this._handleChangeComponentCancel.bind(this)}
          ]}
        >
          <p>确定更换组件为[{data.name}]吗?所有的配置项将会重置!</p>
        </Dialog>
        <List selectable ripple>
          <ListItem caption={`组件类型: ${data.type}`} onClick={this._handleToggleInfo.bind(this)} legend={data.description}
                    rightActions={[
                      <TooltipIconButton key='1' tooltip="查看详情" tooltipPosition="horizontal" icon="info" primary onClick={this._handleToggleInfo.bind(this)} />,
                      <TooltipIconButton key="2" tooltip={installed ? '已安装': '安装组件'} tooltipPosition="horizontal" icon="file_download" onClick={this._handleChangeComponent.bind(this)} accent disabled={installed} />
                    ]}>
            <Chip style={{backgroundColor: '#ff4081', color: '#fff'}} className={styles.chipInList}>{data.name}</Chip>
          </ListItem>
        </List>
        <div ref={this._handleInfoBoxMount.bind(this)} style={{transition: '.3s', overflow: 'hidden', height: showInfo ? this._infoBoxHeight: '0' }}>
          <List>
            <ListDivider />
            <ListSubHeader caption="配置"/>
            {(settings.length == 0 && <ListItem caption='无配置项'/>) || (settingable && componentMap && componentMap.settings && settings.map((setting, index) => {
              return (
                <ListItem
                  key={index}
                  itemContent={
                    <MatchInputWithSubmitAndDescription
                      description={setting.description}
                      onSubmit={value => this._handleSettingUpdate(setting.key, value)}
                      error={updateSettingErrors[setting.key]}
                      disabled={updatingSettings[setting.key]}
                      label={`${setting.key} ${new RegExp(setting.regExp)}`}
                      value={componentMap.settings[setting.key]}
                      match={setting.regExp}
                    />
                  }
                />
              );
            })) || settings.map((setting, index) => {
              return (
                <ListItem key={index} caption={`正则匹配: ${setting.regExp}`} legend={setting.description}><Chip
                  className={styles.chipInList}>{setting.key}</Chip></ListItem>
              );
            })}
            <ListDivider />
            <ListSubHeader caption="属性"/>
            {attributes.length > 0 && attributes.map((attribute, index) => {
              return (
                <ListItem key={index} caption={`类型: ${attribute.type}`} legend={attribute.description}><Chip
                  className={styles.chipInList}>{attribute.name}</Chip></ListItem>
              );
            }) || <ListItem caption="无属性注册"/>}
            <ListDivider />
            <ListSubHeader caption="方法"/>
            {operations.length > 0 && operations.map((operation, index) => {
              return (
                <ListItem key={index} caption={`参数: ${operation.args}`} legend={operation.description}>
                  {operation.danger ? <TooltipFontIcon style={{color: '#ff4081'}} key="1" tooltip="危险方法" tooltipPosition="left" value="error" /> : null}
                  <Chip key="2" className={styles.chipInList}>{operation.name}</Chip>
                </ListItem>
              );
            }) || <ListItem caption="无方法注册"/>}
            <ListDivider />
          </List>
        </div>
      </div>
    );
  }
}

export default ComponentInfo;