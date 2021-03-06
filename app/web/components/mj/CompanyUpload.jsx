import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Tabs, Modal, Spin, notification, Button, message } from "antd";
const TabPane = Tabs.TabPane;
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import CompanyUploadLe from "./components/CompanyUploadLE";
import CompanyUploadBasic from "./components/CompanyUploadBasic";
import "./CompanyUpload.less";

@inject(stores => ({
  store: stores.companyUploadStore,
}))
@hoc({ name: "企业数据上报核对 - 企业", className: "page_companyupload" })
@observer
export default class CompanyUpload extends Component {
  state = {
    loading: false,
  };

  async UNSAFE_componentWillMount() {
    await this.fetchCompanyOption();
  }

  /**
   * fetch basic info (pch)
   * @memberof CompanyUpload
   */
  @autobind
  async fetchCompanyOption() {
    this.setState({ loading: true });
    const { getCompanyInfoByPch } = this.props.store;
    const { visible, state } = await getCompanyInfoByPch();
    const nkey = +new Date();
    !visible &&
      visible !== undefined &&
      notification.warning({
        message: `请完善企业信息`,
        description: "企业用户完善企业信息后,即可查看、核对企业数据",
      });
    notification.config({ duration: 30 });
    state != 0 &&
      notification.error({
        message: "企业状态异常",
        description: "企业状态异常,无法进行企业数据核对操作!",
        key: nkey,
        btn: (
          <Button type="primary" onClick={() => notification.close(nkey)}>
            确认
          </Button>
        ),
      });
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
      title: "确认更新以上企业信息?",
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
              await this.fetchCompanyOption();
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
    return company.visible === undefined ? (
      ""
    ) : (
      <div>
        <Spin spinning={loading}>
          <Tabs defaultActiveKey={company.visible ? "1" : "2"}>
            <TabPane
              tab="企业数据核对"
              key="1"
              disabled={!company.visible || company.state != 0}
            >
              <CompanyUploadLe
                company={company || {}}
                fetchCompanyNameByUuid={this.props.store.fetchCompanyNameByUuid}
                exportEvidence={this.props.store.exportEvidence}
                updateCompanyDataState={this.updateCompanyDataState}
                wrappedComponentRef={instance => {
                  this.companyUploadIndicatorForm = instance;
                }}
              />
            </TabPane>
            <TabPane tab="企业信息" key="2">
              <CompanyUploadBasic
                company={company || {}}
                companyUploadBasicSubmit={this.companyUploadBasicSubmit}
                wrappedComponentRef={instance => {
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
