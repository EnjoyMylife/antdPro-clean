import React, { Component } from 'react';
import { connect } from 'dva';
import { Checkbox, Alert, Icon } from 'antd';
import { Login } from 'ant-design-pro';
import styles from './style.less';
import IconFont from '@/utils/IconFont';
import router from 'umi/router';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ superLogin, loading }) => ({
  superLogin,
  submitting: loading.effects['superLogin/login'],
}))
class LoginPage extends Component {
  state = {
    autoLogin: false,
    type: 'company',
  };

  componentWillMount() {
    // const systemCode = sessionStorage.getItem('systemCode');
    // systemCode && systemCode == 'SUPERVISE' ? this.setState({ type: 'admin' }) : '';
  }
  
  handleSubmit = (err, values) => {
    const { autoLogin, type } = this.state;
    const { dispatch } = this.props;
    if (!values.username || !values.password) return;
    dispatch({
      type: 'login/login',
      payload: {
        ...values,
        systemCode: 'ADMIN',
        rememberMe: autoLogin,
      },
    });
  };
  
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  
  render() {
    const {
      superLogin: { status },
      submitting,
    } = this.props;

    const { autoLogin, type } = this.state;
    return (
      <div className={styles.superMain}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="username"
            placeholder="请输入您的账号"
            autoComplete="off"
            rules={[
              {
                required: true,
                message: ' ',
              },
            ]}
            prefix={<IconFont type="iconwo" />}
            onPressEnter={() => {
              if (
                document.getElementById('username') &&
                document.getElementById('username').value !== ''
              ) {
                document.getElementById('password') && document.getElementById('password').focus();
                document.getElementById('password') && document.getElementById('password').select();
              }
            }}
          />
          <Password
            name="password"
            placeholder="请输入您的密码"
            autoComplete="off"
            prefix={<IconFont type="iconmima" />}
            rules={[
              {
                required: true,
                message: ' ',
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <div className={styles.remember}>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <span>记住密码</span>
            </Checkbox>
          </div>
          <Submit loading={submitting}>登录</Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
