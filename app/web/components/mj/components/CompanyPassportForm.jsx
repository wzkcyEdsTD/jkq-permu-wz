import React, { Component } from "react";
import { Form, Input } from "antd";
export const COMPANY_PASSPORT_FORM_HASH = Symbol("companypassport");
const { Item: FormItem } = Form;
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

class CompanyPassportForm extends Component {
  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue("passwordNew")) {
      callback("Two passwords that you enter is inconsistent!");
    } else {
      callback();
    }
  };
  render() {
    const { form, company } = this.props;
    const { getFieldDecorator } = form;
    getFieldDecorator("name", { initialValue: company.name });
    return (
      <Form className="user-add-update-form">
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="username"
          label="用户名"
        >
          {getFieldDecorator("username", {
            initialValue: company.uuid,
            rules: [
              {
                required: true,
                message: "The input is not valid username!",
              },
            ],
          })(
            <Input disabled placeholder="请输入用户名" style={{ width: 200 }} />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="passwordNew"
          label="新密码"
        >
          {getFieldDecorator("passwordNew", {
            rules: [
              {
                required: true,
                message: "密码不可为空",
              },
              {
                validator: this.validateToNextPassword,
              },
            ],
          })(
            <Input
              placeholder="请输入密码"
              style={{ width: 200 }}
              type="password"
            />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          help={null}
          hasFeedback
          key="confirm"
          label="确认密码"
        >
          {getFieldDecorator("confirm", {
            rules: [
              {
                required: true,
                message: "确认密码不可为空",
              },
              {
                validator: this.compareToFirstPassword,
              },
            ],
          })(
            <Input
              placeholder="请输入密码"
              style={{ width: 200 }}
              type="password"
            />
          )}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(CompanyPassportForm);
