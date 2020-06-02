import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Layout } from "antd";
import bgHomeImage from "../images/bg.png";
import WrappedNormalLoginForm from "./login/NormalLoginForm";
import WrappedNormalRegisteForm from "./login/NormalRegisteForm";

import autobind from "autobind-decorator";

@inject("userStore")
@observer
class LoginPage extends Component {
  state = {
    isLogin: true,
  };

  @autobind
  goLoginOrRegiste() {
    this.setState({
      isLogin: !this.state.isLogin,
    });
  }

  render() {
    const { isLogin } = this.state;
    return (
      <Layout
        style={{ height: "100%", overflow: "hidden" }}
        className="login-page"
      >
        <Layout.Header>
          <div className="logo" />
        </Layout.Header>
        <Layout.Content>
          <img src={bgHomeImage} alt="" />
          <div className="login-form">
            {isLogin ? (
              <WrappedNormalLoginForm history={this.props.history} />
            ) : (
              <WrappedNormalRegisteForm history={this.props.history} />
            )}
            <a className="switchLogin" onClick={this.goLoginOrRegiste}>
              {isLogin ? "还没有账号,去注册" : "已有账号,去登陆"} ->
            </a>
          </div>
        </Layout.Content>
        <Layout.Footer>
          Copyright © wzkcy All Rights Reserved
        </Layout.Footer>
      </Layout>
    );
  }
}

export default LoginPage;
