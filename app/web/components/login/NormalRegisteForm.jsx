import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Icon, Input, Button, message } from "antd";
import autobind from "autobind-decorator";
const FormItem = Form.Item;
const _TIME_ = 60;
@inject((stores) => ({
  store: stores.userStore,
}))
@observer
class NormalRegisteForm extends Component {
  state = {
    loading: false,
    sendingCode: false,
    time: _TIME_,
    timer: undefined,
  };

  /**
   * 账号注册
   * @param {*} e
   * @returns
   * @memberof NormalLoginForm
   */
  @autobind
  async registeSubmit(e) {
    e.preventDefault();
    const { store, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      const params = form.getFieldsValue();
      if (!(params.username && params.password)) {
        return false;
      }
      this.setState({ loading: true });
      try {
        const result = await store.login(params);
        if (result) {
          message.info("登录成功");
          window.location.replace("/");
        }
      } finally {
        this.setState({ loading: false });
      }
    });
  }

  /**
   * 发送验证码
   * @memberof NormalRegisteForm
   */
  @autobind
  async sendCode() {
    const { store, form } = this.props;
    this.setState({
      sendingCode: true,
      time: _TIME_,
      timer: setInterval(() => {
        this.setState({ time: this.state.time - 1 });
        if (this.state.time - 1 < 0) {
          clearInterval(this.state.timer);
          this.setState({ sendingCode: false, timer: undefined });
        }
      }, 1000),
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, sendingCode, time } = this.state;
    return (
      <Form onSubmit={this.registeSubmit}>
        <div className="title">账号注册</div>
        <FormItem>
          {getFieldDecorator("username", {
            rules: [{ required: true, message: "请输入用户名" }],
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="请输入用户名"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "请输入登录密码" }],
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              type="password"
              placeholder="请输入密码"
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator("phone", {
            rules: [{ required: true, message: "请输入手机号码" }],
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="phone" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="请输入手机号码"
            />
          )}
        </FormItem>
        <div className="verifyCodeFrame">
          <FormItem className="verifyCode">
            {getFieldDecorator("code", {
              rules: [{ required: true, message: "请输入验证码" }],
            })(
              <Input
                className="input"
                addonBefore={
                  <Icon type="api" style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder="输入验证码"
              />
            )}
          </FormItem>
          <Button
            style={{ margin: "4px 0 4px 10px" }}
            type="primary"
            disabled={sendingCode}
            onClick={this.sendCode}
          >
            {!sendingCode ? "发送验证码" : `获取验证码(${time}s)`}
          </Button>
        </div>

        <FormItem>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            注册
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(NormalRegisteForm);
