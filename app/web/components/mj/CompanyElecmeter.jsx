import React, { Component } from "react";
import autobind from "autobind-decorator";
import _ from "lodash";
import { Modal, Input, Button, message } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyElecForm from "./components/CompanyElecForm";
import "./CompanyElecmeter.less";
@inject(stores => ({
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
            onChange={e => {
              this.setState({ elecmeter: e.target.value });
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>总用电量:</label>
          <Input
            placeholder="请输入用电量"
            style={{ width: "180px" }}
            type="number"
            onChange={e => {
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
    const sval = eval(
      Object.keys(values)
        .filter(v => v.includes("elec"))
        .map(v => parseInt(values[v], 10))
        .join("+")
    );
    return elec == sval;
  }

  /**
   * 生成用电列表
   * @param {*} values
   */
  @autobind
  fixElecDatatoObj(values) {
    const keys = Object.keys(values);
    const ids = [...new Set(keys.map(v => v.split("-")[1]))];
    const obj = {},
      arr = [];
    for (let i in values) {
      const [index, id] = i.split("-");
      if (!~ids.indexOf(id)) continue;
      else {
        !obj[id] && (obj[id] = {});
        obj[id][index] = values[i];
      }
    }
    //  check
    if (
      [...new Set(Object.keys(obj).map(v => obj[v].uuid))].length != ids.length
    ) {
      return false;
    }
    ids.map(v => {
      arr.push(obj[v]);
    });
    return arr;
  }

  /**
   * 企业指标确认提交
   * @param {*} params
   * @memberof CompanyUpload
   */
  @autobind
  async updateCompanyElecmenter() {
    const { updateCompanyElecmenter } = this.props.store;
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
      const elecDataObj = this.fixElecDatatoObj(values);
      if (!elecDataObj) return message.error("社会统一信用代码不可重复");
      Modal.confirm({
        title: "确认提交该共用电表登记信息?",
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          try {
            this.setState({ loading: true });
            await updateCompanyElecmenter(elecmeter, elec, elecDataObj);
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
          wrappedComponentRef={instance => {
            this.companyElecForm = instance;
          }}
        />
        <div>
          <Button
            loading={loading}
            type="primary"
            onClick={this.updateCompanyElecmenter}
          >
            提交
          </Button>
        </div>
      </div>
    );
  }
}
