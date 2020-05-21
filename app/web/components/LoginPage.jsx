import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Layout } from "antd";
const { Header, Footer, Content } = Layout;
import bgHomeImage from "../images/bg.png";
import WrappedNormalLoginForm from "./login/NormalLoginForm";
import WrappedNormalRegisteForm from "./login/NormalRegisteForm";

import autobind from "autobind-decorator";

@inject("userStore")
@observer
class LoginPage extends Component {
  state = {
    isLogin: false,
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
        <Header>
          <div className="logo" />
        </Header>
        <Content>
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
        </Content>
        <Footer>
          Copyright © wzkcy All Rights Reserved 浙ICP备 xxxxxxx号
          浙公网安备xxxxxxxxx号
        </Footer>
      </Layout>
    );
  }
}

export default LoginPage;
