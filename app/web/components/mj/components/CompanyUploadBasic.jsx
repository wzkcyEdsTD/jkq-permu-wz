import React, { Component } from "react";
import { observer } from "mobx-react";
import { Form, Tooltip, Icon, Input, Button } from "antd";
const { Item: FormItem } = Form;
import { checkMobile } from "utils/validation";
import autobind from "autobind-decorator";
export const COMPANY_UPLOAD_BASIC_FORM_HASH = Symbol("handled");
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

@observer
class CompanyUploadBasic extends Component {
  state = {
    savingLoad: false,
  };

  @autobind
  async companyUploadBasicSubmit() {
    const { companyUploadBasicSubmit } = this.props;
    this.setState({ savingLoad: true });
    try {
      await companyUploadBasicSubmit();
    } finally {
      this.setState({ savingLoad: false });
    }
  }

  render() {
    const { form, company } = this.props;
    const { savingLoad } = this.state;
    const { getFieldDecorator } = form;
    getFieldDecorator("pch", { initialValue: company.pch });

    return (
      <Form className="form-companyUploadBasic">
        <FormItem {...formItemLayout} label="公司名称">
          {getFieldDecorator("name", {
            initialValue: company.name,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="所属街道">
          {getFieldDecorator("street", {
            initialValue: company.street,
          })(<Input disabled />)}
        </FormItem>
        <FormItem {...formItemLayout} label="企业信用代码">
          {getFieldDecorator("uuid", {
            initialValue: company.uuid,
          })(<Input disabled />)}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label={
            <Tooltip title={"若地址有误请联系所在街道进行修改"}>
              <Icon
                type="question-circle"
                style={{
                  fontSize: 18,
                  marginRight: 4,
                  verticalAlign: "middle",
                }}
              />
              企业地址
            </Tooltip>
          }
        >
          {getFieldDecorator("address", {
            initialValue: company.address,
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
            onClick={this.companyUploadBasicSubmit}
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
