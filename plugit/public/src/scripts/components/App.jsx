import React, {Component} from 'react';
import Navigator from './Navigator';
import Dialog from 'react-toolbox/lib/dialog';
import Input from 'react-toolbox/lib/input';
import {login, checkAuth, logout} from '../actions/app';

export default class App extends Component {

  constructor (props) {
    super(props);
    this.state = {
      showLogin: true,
      username: '',
      password: ''
    };
  }

  componentWillMount () {
    this.props.dispatch(checkAuth());
  }

  componentDidUpdate(prevProps) {
    const {showLogin} = this.state;
    const {isLogged} = this.props;
    if(isLogged && showLogin) {
      this._handleLoginSuccess();
      this.setState({showLogin: false});
    } else if(!isLogged && !showLogin) {
      this.setState({showLogin: true});
    }
  }

  _handleLoginSuccess() {
    if(this.props.data.jwt) localStorage.setItem('jwt', this.props.data.jwt);
  }

  _handleLogin() {
    const {username, password} = this.state;
    this.props.dispatch(login(username, password));
  }

  _handlePasswordChanged (password) {
    this.setState({password});
  }

  _handleUsernameChanged (username) {
    this.setState({username});
  }

  _handleKeyPress (e) {
    if(e.key === 'Enter') {
      this._handleLogin();
    }
  }

  render() {
    const {showLogin} = this.state;
    return (
      <div>
        <Dialog actions={[
          {label: '登陆', primary: true, onClick: this._handleLogin.bind(this)}
        ]} active={showLogin} title="请输入用户名和密码" type="small">
          <Input type="text" label="用户名" icon="face" onKeyPress={this._handleKeyPress.bind(this)} onChange={this._handleUsernameChanged.bind(this)}/>
          <Input type="password" label="密码" icon="lock" maxLength={16} onKeyPress={this._handleKeyPress.bind(this)} onChange={this._handlePasswordChanged.bind(this)}/>
          <p style={{color: 'red'}}>{this.props.error}</p>
        </Dialog>
        {showLogin ? null : (
          <div>
            <Navigator />
            <div style={{ paddingTop: '6.4rem', position: 'fixed', width: '100%', height: '100%'}}>
              {this.props.children}
            </div>
          </div>
        )}
      </div>
    );
  }
}