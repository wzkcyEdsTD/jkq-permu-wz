import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Tabs, message, Modal, Spin } from "antd";
const TabPane = Tabs.TabPane;
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyUploadEl from "./components/CompanyUploadEL";
import CompanyUploadBasic from "./components/CompanyUploadBasic";
import "./CompanyUpload.less";

@inject((stores) => ({
  store: stores.companyUploadStore,
  userStore: stores.userStore,
}))
@hoc({ name: "企业数据上报核对 - 企业", className: "page_companyupload" })
@observer
export default class CompanyUpload extends Component {
  state = {
    loading: false,
  };

  async componentDidMount() {
    await this.fetchCompanyOption();
  }

  /**
   * fetch basic info (pch)
   * @memberof CompanyUpload
   */
  @autobind
  async fetchCompanyOption() {
    this.setState({ loading: true });
    const { currentUser } = this.props.userStore;
    const { getCompanyInfoByPch } = this.props.store;
    await getCompanyInfoByPch(currentUser);
    this.setState({ loading: false });
  }

  /**
   * 企业指标确认提交
   * @param {*} params
   * @memberof CompanyUpload
   */
  @autobind
  async updateCompanyDataState(params) {
    const { updateCompanyDataState } = this.props.store;
    Modal.confirm({
      title: "确认更新以上企业指标确认情况?",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await updateCompanyDataState(params);
          message.success(`[${params.name}] 基本信息修改成功`);
          await this.fetchCompanyOption();
        } catch (e) {
          message.error(e);
        } finally {
        }
      },
    });
  }

  /**
   * 企业信息确认提交
   * @memberof CompanyData
   */
  @autobind
  async companyUploadBasicSubmit() {
    const { form } = this.companyUploadBasicForm.props;
    const { companyUploadBasicSubmit } = this.props.store;

    form.validateFieldsAndScroll(
      async (err, { pch, uuid, name, link, linkphone }) => {
        if (err) return;
        Modal.confirm({
          title: "确认更新企业基本信息?",
          okText: "确定",
          cancelText: "取消",
          onOk: async () => {
            try {
              await companyUploadBasicSubmit({
                pch,
                uuid,
                states: { link, linkphone },
              });
              message.success(`[${name}] 基本信息修改成功`);
            } catch (e) {
              message.error(e);
            } finally {
            }
          },
        });
      }
    );
  }

  render() {
    const { loading } = this.state;
    const { company } = this.props.store;
    return (
      <div>
        <Spin spinning={loading}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="企业数据核对" key="1">
              <CompanyUploadEl
                company={company || {}}
                fetchCompanyNameByUuid={this.props.store.fetchCompanyNameByUuid}
                updateCompanyDataState={this.updateCompanyDataState}
                wrappedComponentRef={(instance) => {
                  this.companyUploadIndicatorForm = instance;
                }}
              />
            </TabPane>
            <TabPane tab="企业信息" key="2">
              <CompanyUploadBasic
                company={company || {}}
                companyUploadBasicSubmit={this.companyUploadBasicSubmit}
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
