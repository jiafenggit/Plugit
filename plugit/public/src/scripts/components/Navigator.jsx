import React, {Component} from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import AppBar from 'react-toolbox/lib/app_bar';
import {Button} from 'react-toolbox/lib/button';
import styles from '../../less/common.less';
import { hashHistory } from 'react-router';

class Navigator extends Component {
  render() {
    return (
      <AppBar className={styles.header} fixed flat>

        <Navigation type='horizontal'>
          <Button onClick={_ => hashHistory.push('/')}>组件映射</Button>
          <Button onClick={_ => hashHistory.push('/componentRegistry')}>组件注册</Button>
          <Button onClick={_ => hashHistory.push('/pluginMaps')}>插件映射</Button>
          <Button onClick={_ => hashHistory.push('/pluginRegistry')}>插件注册</Button>
          <Button onClick={_ => hashHistory.push('/workflowGenerator')}>工作流生成器</Button>
        </Navigation>
      </AppBar>
    );
  }
}

export default Navigator;