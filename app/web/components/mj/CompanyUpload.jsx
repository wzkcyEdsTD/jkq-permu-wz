import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Tabs, message, Modal, Spin } from "antd";
const TabPane = Tabs.TabPane;
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyUploadEl from "./components/CompanyUploadEL";
import CompanyUploadIndicator from "./components/CompanyUploadIndicator";
import CompanyUploadBasic from "./components/CompanyUploadBasic";

@inject((stores) => ({
  store: stores.companyUploadStore,
  userStore: stores.userStore,
}))
@hoc({ name: "企业数据上报核对 - 企业", className: "page_companyupload" })
@observer
export default class CompanyUpload extends Component {
  state = {
    loading: false,
    savingLoad: false,
  };

  async componentWillMount() {
    this.setState({ loading: true });
    await this.fetchCompanyOption();
    this.setState({ loading: false });
  }

  @autobind
  async fetchCompanyOption() {
    const { currentUser } = this.props.userStore;
    const { getCompanyInfoByPch } = this.props.store;
    await getCompanyInfoByPch(currentUser);
  }

  /**
   * 企业数据核对上报
   * @param {*} listIndex
   */
  @autobind
  async companyUploadIndicatorSubmit(listIndex) {
    console.log(listIndex);
  }

  /**
   * 企业信息确认提交
   * @memberof CompanyData
   */
  @autobind
  async companyUploadBasicSubmit() {
    const { form } = this.companyUploadBasicForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      Modal.confirm({
        title: "确认更新企业基本信息?",
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          this.setState({ savingLoad: true });
          try {
            message.success(`[${values.name}] 基本信息修改成功`);
          } finally {
            this.setState({ savingLoad: false });
          }
        },
      });
    });
  }

  render() {
    const { loading } = this.state;
    const { company } = this.props.store;
    return (
      <div>
        <Spin spinning={loading}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="用地用电数据" key="1">
              <CompanyUploadEl
                company={company || {}}
                upload={this.companyUploadIndicatorSubmit}
                fetchCompanyNameByUuid={this.props.store.fetchCompanyNameByUuid}
                saving={this.savingLoad}
                wrappedComponentRef={(instance) => {
                  this.companyUploadIndicatorForm = instance;
                }}
              />
            </TabPane>
            <TabPane tab="企业数据核对" key="2">
              <CompanyUploadIndicator
                company={company || {}}
                upload={this.companyUploadIndicatorSubmit}
                saving={this.savingLoad}
                wrappedComponentRef={(instance) => {
                  this.companyUploadIndicatorForm = instance;
                }}
              />
            </TabPane>
            <TabPane tab="企业信息" key="3">
              <CompanyUploadBasic
                company={company || {}}
                upload={this.companyUploadBasicSubmit}
                saving={this.savingLoad}
                wrappedComponentRef={(instance) => {
                  this.companyUploadBasicForm = instance;
                }}
              />
            </TabPane>
          </Tabs>
        </Spin>
      </div>
    );
  }
}
