import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Form, Icon, Input, Button, message } from "antd";
import autobind from "autobind-decorator";
const FormItem = Form.Item;

@inject((stores) => ({
  store: stores.userStore,
}))
@observer
class NormalLoginForm extends Component {
  state = {
    loading: false,
  };

  /**
   * 账号登录
   * @param {*} e
   * @returns
   * @memberof NormalLoginForm
   */
  @autobind
  async loginSubmit(e) {
    e.preventDefault();
    const { store, form } = this.props;
    form.validateFieldsAndScroll(async (err, values) => {
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.state;
    return (
      <Form onSubmit={this.loginSubmit}>
        <div className="title">温州市经开区亩均论英雄</div>
        <FormItem>
          {getFieldDecorator("username", {
            rules: [
              {
                required: true,
                message: "请输入用户名",
              },
            ],
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
            rules: [
              {
                required: true,
                message: "请输入登录密码",
              },
            ],
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
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            loading={loading}
          >
            登录
          </Button>
        </FormItem>
      </Form>
    );
  }
}
export default Form.create()(NormalLoginForm);
