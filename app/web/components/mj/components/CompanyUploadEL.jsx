import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import shortid from "shortid";
import {
  Form,
  Input,
  Divider,
  Table,
  Button,
  Tag,
  Select,
  message,
  Statistic,
  Row,
  Col,
} from "antd";
const { Option } = Select;
import { toJS } from "mobx";
import autobind from "autobind-decorator";
export const COMPANY_DATA_FORM_HASH = Symbol("companydata");

/**
 * 企业信息填报核对
 * @class CompanyDataForm
 * @extends {Component}
 */
@observer
class CompanyUploadEL extends Component {
  state = {
    company_mj_lands: [],
    company_mj_elecs: [],
    company_mj_land_rent: [],
  };

  @autobind
  async UNSAFE_componentWillReceiveProps() {
    const { company } = this.props;
    if (!company.uuid) return;
    const uuids2names = await this.fetchCompanyNameByUuid([
      ...new Set([
        ...company.company_mj_lands.map((v) => v.uuid),
        ...company.company_mj_land_rent.map((v) => v.to_object),
      ]),
    ]);
    console.log(company.company_mj_lands);
    this.setState({
      company_mj_lands: company.company_mj_lands.map((v) => ({
        ...v,
        cname: uuids2names[v.uuid] || "",
        edit: false,
      })),
      company_mj_elecs: company.company_mj_elecs.map((v) => ({
        ...v,
        edit: false,
      })),
      company_mj_land_rent: company.company_mj_land_rent.map((v) => ({
        ...v,
        cname: uuids2names[v.to_object] || "",
        edit: false,
      })),
    });
  }

  elecColumns = [
    {
      title: "序号",
      dataIndex: "id",
      width: 80,
      render: (t, r, index) => ++index,
    },
    { title: "电表号", dataIndex: "elecmeter" },
    { title: "年度用电表(千瓦时)", dataIndex: "elec" },
  ];

  landColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    {
      title: "用地类别",
      dataIndex: "type",
      render: (t, r) => (
        <Tag color={t ? "geekblue" : "green"}>
          {t ? "自有用地" : "租赁用地"}
        </Tag>
      ),
    },
    {
      title: "用地面积(平方米)",
      dataIndex: "area",
      width: 180,
    },
    { title: "出租企业信息", dataIndex: "cname" },
    {
      title: "出租企业信用代码",
      dataIndex: "uuid",
      width: 180,
      render: (t, r) => (r.type ? "自有" : t),
    },
  ];

  landRentColumns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "承租企业信用代码", dataIndex: "to_object", key: "to_object" },
    { title: "承租企业名称", dataIndex: "cname", key: "cname" },
    { title: "出租用地面积", dataIndex: "area", key: "area" },
  ];

  /**
   * 获取企业名称
   * @param {*} uuids
   * @memberof CompanyDataForm
   */
  @autobind
  async fetchCompanyNameByUuid(uuids) {
    const { fetchCompanyNameByUuid } = this.props;
    const uuids2names = await fetchCompanyNameByUuid(uuids);
    return uuids2names;
  }

  render() {
    const { form, company, status } = this.props;
    const {
      company_mj_elecs,
      company_mj_lands,
      company_mj_land_rent,
    } = this.state;
    const { getFieldDecorator } = form;
    const landget =
      eval(
        company_mj_lands
          .filter((d) => d.type != 1)
          .map((d) => d.area)
          .join("+")
      ) || 0;
    // getFieldDecorator("id", { initialValue: company.id });
    return (
      <Form className="form-companyUploadBasic">
        <Divider dashed orientation="left" className="land_divider">
          [{company.name}] 用地数据登记
        </Divider>
        <Table
          dataSource={toJS(company_mj_lands)}
          columns={this.landColumns}
          rowKey={(r) => r.id}
          pagination={false}
          rowClassName={(r) => (r.type ? "_self" : "_other")}
          expandedRowRender={(r) => {
            return r.type ? (
              <Table
                title={() => "企业用地出租信息"}
                size="small"
                columns={this.landRentColumns}
                pagination={false}
                rowKey={(_r) => _r.id}
                dataSource={company_mj_land_rent}
              />
            ) : undefined;
          }}
        />
        <Row gutter={24} style={{ marginTop: 10, marginBottom: 8 }}>
          <Col span={3} offset={4}>
            <Statistic title="自由用地(㎡)" value={company.landself} />
          </Col>
          <Col span={1} className="char">
            +
          </Col>
          <Col span={3}>
            <Statistic title="租赁用地(㎡)" value={landget} />
          </Col>
          <Col span={1} className="char">
            -
          </Col>
          <Col span={3}>
            <Statistic title="出租用地(㎡)" value={company.landr} />
          </Col>
          <Col span={1} className="char">
            =
          </Col>
          <Col span={3}>
            <Statistic
              title="实际用地(㎡)"
              value={company.landself + landget - company.landr}
            />
          </Col>
        </Row>
        <Divider dashed orientation="left" className="elec_divider">
          [{company.name}] 用电数据登记
        </Divider>
        <Table
          dataSource={toJS(company_mj_elecs)}
          columns={this.elecColumns}
          rowKey={(r) => r.id}
          pagination={false}
        />
      </Form>
    );
  }
}

export default Form.create()(CompanyUploadEL);
