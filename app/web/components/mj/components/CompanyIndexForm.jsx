import React, { Component } from "react";
import { observer } from "mobx-react";
import { Form, Input } from "antd";
const { Item: FormItem } = Form;
export const COMPANY_INDEX_FORM_HASH = Symbol("companyindex");
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 14 },
};

@observer
class CompanyIndexForm extends Component {
  render() {
    const { form, company } = this.props;
    const { company_mj_datum } = company;
    const { getFieldDecorator } = form;
    getFieldDecorator("pch", { initialValue: company.pch });
    getFieldDecorator("uuid", { initialValue: company.uuid });
    getFieldDecorator("name", { initialValue: company.name });
    return (
      <Form className="form-companyIndex">
        <FormItem {...formItemLayout} label="实缴税金(万)">
          {getFieldDecorator("tax", {
            initialValue: company_mj_datum.tax,
            rules: [{ required: true, message: "请输入实缴税金" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="主营业收入(万)">
          {getFieldDecorator("revenue", {
            initialValue: company_mj_datum.revenue,
            rules: [{ required: true, message: "请输入主营业收入" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="工业增加值(万)">
          {getFieldDecorator("industrial", {
            initialValue: company_mj_datum.industrial,
            rules: [{ required: true, message: "请输入工业增加值" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="综合能耗(吨标煤)">
          {getFieldDecorator("energy", {
            initialValue: company_mj_datum.energy,
            rules: [{ required: true, message: "请输入综合能耗" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="研发经费(万)">
          {getFieldDecorator("rde", {
            initialValue: company_mj_datum.rde,
            rules: [{ required: true, message: "请输入研发经费" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="年平均员工(人)">
          {getFieldDecorator("staff", {
            initialValue: company_mj_datum.staff,
            rules: [{ required: true, message: "请输入年平均员工" }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="排污量(吨)">
          {getFieldDecorator("sewage", {
            initialValue: company_mj_datum.sewage,
            rules: [{ required: true, message: "请输入排污量" }],
          })(<Input />)}
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(CompanyIndexForm);
