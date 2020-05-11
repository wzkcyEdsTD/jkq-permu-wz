export const COMPANY_DATA_FORM_HASH = Symbol("companydata");
import React, { Component } from "react";
import { observer } from "mobx-react";
import { List, Row, Col, Typography } from "antd";
import autobind from "autobind-decorator";

/**
 * 企业共用电表
 * @class CompanyElecmeterList
 * @extends {Component}
 */
@observer
class CompanyElecmeterList extends Component {
  state = {
    elecList: [],
  };

  async componentDidMount() {
    await this.getCompanyElecmenter();
  }

  /**
   * 获取企业共用电表信息
   * @memberof CompanyElecmeterList
   */
  @autobind
  async getCompanyElecmenter() {
    const { company } = this.props;
    const elecList = await this.props.getCompanyElecmenter(company.uuid);
    this.setState({ elecList });
  }

  render() {
    const { elecList } = this.state;
    return elecList.length ? (
      <List
        dataSource={elecList}
        renderItem={(v) => (
          <List.Item>
            <div style={{ width: 300, padding: 0 }}>
              <div>[电表号] {v.elecmeter}</div>
              <div>
                [总用电量] <Typography.Text mark>{v.elec}</Typography.Text>{" "}
                千瓦时
              </div>
              <div>[操作人] {v.operator}</div>
            </div>
            <Row span={24} style={{ boxSizing: "border-box", padding: 10 }}>
              {v.companys.map((v) => (
                <Row
                  style={{ borderBottom: "1px dashed #ccc", padding: "10px 0" }}
                >
                  <Col span={12}>[企业名称] {v.name}</Col>
                  <Col span={12}>[统一信用代码] {v.uuid}</Col>
                  <Col span={12}>[联系人] {v.link}</Col>
                  <Col span={12}>[联系方式] {v.linkphone}</Col>
                  <Col span={12}>
                    [用电量] <Typography.Text mark>{v.elec}</Typography.Text>{" "}
                    千瓦时
                  </Col>
                </Row>
              ))}
            </Row>
          </List.Item>
        )}
      />
    ) : (
      <span>无公用电表信息</span>
    );
  }
}
export default CompanyElecmeterList;
