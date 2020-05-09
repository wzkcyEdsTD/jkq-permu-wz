import React, { Component } from "react";
import autobind from "autobind-decorator";
import _ from "lodash";
import { message, Modal, Form, Input, Button } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyElecForm from "./components/CompanyElecForm";
import "./CompanyElecmeter.less";
@inject((stores) => ({
  store: stores.companyElecmeterStore,
}))
@hoc({ name: "共用电表登记 - 街道", className: "page_companyelecmeter" })
@observer
export default class CompanyElecmeter extends Component {
  state = {
    loading: false,
    elecmeter: undefined,
    elec: undefined,
  };

  @autobind
  searchLeft() {
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>电表号:</label>
          <Input
            placeholder="请输入电表号"
            style={{ width: "180px" }}
            onChange={(e) => {
              this.setState({ elecmeter: e.target.value });
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>总用电量:</label>
          <Input
            placeholder="请输入用电量"
            style={{ width: "180px" }}
            onChange={(e) => {
              this.setState({ elec: e.target.value });
            }}
          />{" "}
          <span>(千瓦时)</span>
        </span>
      </span>
    );
  }

  /**
   * 验证用电量总和
   * @param {*} elec
   * @param {*} values
   */
  @autobind
  validateElecData(elec, values) {
    return (
      elec ==
      evel(
        Object.keys(values)
          .filter((v) => v.includes("elec"))
          .map((v) => values[v].elec)
          .join("+")
      )
    );
  }

  /**
   * 企业指标确认提交
   * @param {*} params
   * @memberof CompanyUpload
   */
  @autobind
  async updateCompanyElecmenter() {
    const { elecmeter, elec } = this.state;
    if (!elecmeter) return message.error("请填写电表号");
    if (!elec) return message.error("请填写总用电量");
    const { form } = this.companyElecForm.props;
    form.validateFields(async (err, values) => {
      if (err) {
        return;
      }
      if (!this.validateElecData(elec, values))
        return message.error("请验证用电量总和");
      Modal.confirm({
        title: "确认提交该共用电表登记信息?",
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          try {
            this.setState({ loading: true });
            message.success(`电表号 [${elecmeter}] 公用信息登记成功`);
          } catch (e) {
            message.error(e);
          } finally {
            this.setState({ loading: false });
          }
        },
      });
    });
  }

  render() {
    const { loading } = this.state;
    const { fetchCompanyNameByUuid } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <CompanyElecForm
          fetchCompanyNameByUuid={fetchCompanyNameByUuid}
          wrappedComponentRef={(instance) => {
            this.companyElecForm = instance;
          }}
        />
        <Button
          loading={loading}
          type="primary"
          onClick={this.updateCompanyElecmenter}
        >
          提交
        </Button>
      </div>
    );
  }
}
