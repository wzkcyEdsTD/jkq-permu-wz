import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Icon, Input, Button, message } from "antd";
import { checkMobile, checkUuid } from "utils/validation";
import autobind from "autobind-decorator";
const FormItem = Form.Item;
const _TIME_ = 60;

@inject(stores => ({
  store: stores.normalRegisteStore,
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
      this.setState({ loading: true });
      try {
        await store.registeBySmsCode(params);
        message.info("注册成功!");
        window.location.replace("/");
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
    const { phone } = form.getFieldsValue();
    if (
      !phone ||
      !/^1([358][0-9]|4[579]|66|7[0135678]|9[89])[0-9]{8}$/.test(phone)
    ) {
      return message.error("请输入正确手机号码");
    }
    try {
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
      await store.getSmsCode(phone);
    } finally {
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, sendingCode, time } = this.state;
    return (
      <Form onSubmit={this.registeSubmit}>
        <div className="title">账号注册</div>
        <FormItem>
          {getFieldDecorator("username", {
            rules: [
              { required: true, message: "请输入统一信用代码" },
              ,
              { validator: checkUuid },
            ],
          })(
            <Input
              className="input"
              addonBefore={
                <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
              }
              placeholder="请输入统一信用代码"
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
            rules: [
              { required: true, message: "请输入手机号码" },
              { validator: checkMobile },
            ],
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
