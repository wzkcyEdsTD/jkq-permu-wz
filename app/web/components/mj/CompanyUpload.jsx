import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Tabs, Button, message, Modal } from "antd";
const TabPane = Tabs.TabPane;
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyUploadEl from "./components/CompanyUploadEL";
import CompanyUploadIndicator from "./components/CompanyUploadIndicator";
import CompanyUploadBasic from "./components/CompanyUploadBasic";

@inject((stores) => ({
  store: stores.companyUploadStore,
}))
@hoc({ name: "企业数据上报核对 - 企业", className: "page_companydata" })
@observer
export default class CompanyData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    companybase: null,
    companyindicator: null,
    companyelec: null,
    companyland: null,
  };

  componentWillMount() {}

  async componentDidMount() {
    await this.fetchCompanyOption();
  }

  @autobind
  async fetchCompanyOption() {}

  @autobind
  async companyUploadIndicatorSubmit(listIndex) {
    console.log(listIndex);
  }

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
    const {
      companybase,
      companyindicator,
      companyland,
      companyelec,
    } = this.state;
    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="企业数据核对" key="1">
            <CompanyUploadIndicator
              companyindicator={companyindicator || {}}
              upload={this.companyUploadIndicatorSubmit}
              saving={this.savingLoad}
              wrappedComponentRef={(instance) => {
                this.companyUploadIndicatorForm = instance;
              }}
            />
          </TabPane>
          <TabPane tab="用地用电数据" key="2">
            <CompanyUploadEl
              companyland={companyland || {}}
              companyelec={companyelec || {}}
              upload={this.companyUploadIndicatorSubmit}
              saving={this.savingLoad}
              wrappedComponentRef={(instance) => {
                this.companyUploadIndicatorForm = instance;
              }}
            />
          </TabPane>
          <TabPane tab="企业信息" key="3">
            <CompanyUploadBasic
              companybase={companybase || {}}
              upload={this.companyUploadBasicSubmit}
              saving={this.savingLoad}
              wrappedComponentRef={(instance) => {
                this.companyUploadBasicForm = instance;
              }}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
