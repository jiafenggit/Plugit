import React, {Component} from 'react';
import Navigation from 'react-toolbox/lib/navigation';
import AppBar from 'react-toolbox/lib/app_bar';
import {Button} from 'react-toolbox/lib/button';
import styles from '../../less/common.less';

class Navigator extends Component {
  render() {
    return (
      <AppBar className={styles.header} fixed flat>
        <Navigation type='horizontal'>
          <Button>组件映射</Button>
          <Button>组件注册</Button>
          <Button>插件映射</Button>
          <Button>插件注册</Button>
        </Navigation>
      </AppBar>
    );
  }
}

export default Navigator;