import React, { Component } from "react";
import { observer } from "mobx-react";
import { Form, Input, Divider, Table, Button, Tag } from "antd";
import { toJS } from "mobx";
const { Item: FormItem } = Form;
import { checkMobile } from "utils/validation";
export const COMPANY_DATA_FORM_HASH = Symbol("companydata");
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 10 },
};

/**
 * 企业信息填报核对
 * @class CompanyDataForm
 * @extends {Component}
 */
@observer
class CompanyDataForm extends Component {
  state = {
    company_mj_lands: [],
    company_mj_elecs: [],
  };

  elecColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "电表号", dataIndex: "elecmeter" },
    { title: "年度用电表(千瓦时)", dataIndex: "elec" },
    { title: "操作", dataIndex: "action", render: () => <a>删除记录</a> },
  ];

  landColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    {
      title: "用地类别",
      dataIndex: "type",
      render: (t) => (
        <Tag color={t ? "geekblue" : "green"}>
          {t ? "自有用地" : "租赁用地"}
        </Tag>
      ),
    },
    { title: "用地面积(平方米)", dataIndex: "area" },
    { title: "出租企业信息", dataIndex: "to_obj" },
    {
      title: "出租企业信用代码",
      dataIndex: "to_object",
      render: (t, r) => (r.type ? "" : t),
    },
    { title: "操作", dataIndex: "action", render: () => <a>删除记录</a> },
  ];

  async componentDidMount() {
    const { company } = this.props;
    this.setState({
      company_mj_lands: company.company_mj_lands,
      company_mj_elecs: company.company_mj_elecs,
    });
    // await this.fetchOtherList();
  }

  render() {
    const { form, company } = this.props;
    const { company_mj_elecs, company_mj_lands } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Form className="form-companyUploadBasic">
        <Divider dashed orientation="left" className="basic_divider">
          [{company.name}] 基本信息
        </Divider>
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
        <FormItem {...formItemLayout} label="企业地址">
          {getFieldDecorator("address", {
            initialValue: company.address,
          })(<Input placeholder="请输入企业地址" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="联系方式">
          {getFieldDecorator("legalphone", {
            initialValue: company.legalphone,
            rules: [{ validator: checkMobile }],
          })(<Input placeholder="请输入联系方式" />)}
        </FormItem>
        <Divider dashed orientation="left" className="land_divider">
          [{company.name}] 用地数据登记
        </Divider>
        <Button type="primary">新增用地数据</Button>
        <Table
          dataSource={toJS(company_mj_lands)}
          columns={this.landColumns}
          rowKey={(r) => r.to_object}
          pagination={false}
          rowClassName={(r) => (r.type ? "_self" : "_other")}
          expandedRowRender={(r) => (r.type ? <p>{r.to_object}</p> : undefined)}
        />
        <Divider dashed orientation="left" className="elec_divider">
          [{company.name}] 用电数据登记
        </Divider>
        <Button type="primary">新增用电数据</Button>
        <Table
          dataSource={toJS(company_mj_elecs)}
          columns={this.elecColumns}
          rowKey={(r) => r.elecmeter}
          pagination={false}
        />
      </Form>
    );
  }
}

export default Form.create()(CompanyDataForm);
