import React, { Component } from "react";
import { observer } from "mobx-react";
import { Form, Input, Button } from "antd";
const { Item: FormItem } = Form;
import { checkMobile } from "utils/validation";
export const COMPANY_UPLOAD_BASIC_FORM_HASH = Symbol("handled");
const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 10 },
};

@observer
class CompanyUploadBasic extends Component {
  render() {
    const { form, company, upload, savingLoad } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form className="form-companyUploadBasic">
        <FormItem {...formItemLayout} label="公司名称">
          {getFieldDecorator("name", {
            initialValue: company.name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="企业信用代码">
          {getFieldDecorator("uuid", {
            initialValue: company.uuid,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系人">
          {getFieldDecorator("link", {
            initialValue: company.link,
            rules: [{ required: true, message: "请输入联系人" }],
          })(<Input placeholder="请输入企业联系人" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator("linkphone", {
            initialValue: company.linkphone,
            rules: [
              { required: true, message: "请输入联系方式" },
              { validator: checkMobile },
            ],
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        <Form.Item wrapperCol={{ span: 8, offset: 3 }}>
          <Button
            type="primary"
            htmlType="submit"
            onClick={upload}
            loading={savingLoad}
          >
            基本信息更新
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(CompanyUploadBasic);
