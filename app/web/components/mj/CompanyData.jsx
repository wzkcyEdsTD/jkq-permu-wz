import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Table, Modal, Input, Select, Tag, Button, message } from "antd";
const { Option } = Select;
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import CompanyDataForm, {
  COMPANY_DATA_FORM_HASH,
} from "./components/CompanyDataForm";
import CompanyPassportForm, {
  COMPANY_PASSPORT_FORM_HASH,
} from "./components/CompanyPassportForm";
import hoc from "components/HOC/pageHeader";
import "./CompanyData.less";

@inject(stores => ({
  store: stores.companyDataStore,
  userStore: stores.userStore,
}))
@hoc({
  name: "企业数据审核 - 街道",
  className: "page_companydata",
  ftable: true,
})
@observer
export default class CompanyData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    downLoading: false,
    formModalVisiable: false,
    passportModalVisiable: false,
    edit: null,
    statusOption: [
      { key: 0, title: "正常" },
      { key: 1, title: "非本街道" },
      { key: 2, title: "注销" },
      { key: 3, title: "迁出" },
      { key: 4, title: "迁入保护" },
      { key: 5, title: "纳税小于3万" },
      { key: 6, title: " 税收及收入无法匹配" },
    ],
    confirmOption: [
      { key: 2, title: "全部" },
      { key: 1, title: "已确认" },
      { key: 0, title: "未确认" },
    ],
    scaleOption: [
      { key: 1, title: "规上" },
      { key: 0, title: "规下" },
    ],
    pchOption: [
      { key: 2019, title: "2019年度" },
      { key: 2018, title: "2018年度" },
    ],
    scrolly: 0,
  };

  async componentDidMount() {
    this.setState({
      scrolly: document.getElementById("flex-ant-table").offsetHeight - 120,
    });
    await this.fetchList();
  }

  /**
   * 对应hash关闭&开启modal
   * @param {*} hash
   */
  @autobind
  hideModal(hash) {
    switch (hash) {
      case COMPANY_DATA_FORM_HASH: {
        this.setState({
          formModalVisiable: false,
          edit: null,
        });
        break;
      }
      case COMPANY_PASSPORT_FORM_HASH: {
        this.setState({
          passportModalVisiable: false,
          edit: null,
        });
        break;
      }
    }
  }
  @autobind
  openModal(hash, obj = null) {
    console.log("[open]", hash);
    switch (hash) {
      case COMPANY_DATA_FORM_HASH: {
        this.setState({
          formModalVisiable: true,
          edit: obj,
        });
        break;
      }
      case COMPANY_PASSPORT_FORM_HASH: {
        this.setState({
          passportModalVisiable: true,
          edit: obj,
        });
        break;
      }
    }
  }

  /**
   * 获取企业信息列表
   * @memberof CompanyData
   */
  @autobind
  async fetchList() {
    const { getCompanyListByPch } = this.props.store;
    const { currentUser, currentGroup } = this.props.userStore;
    this.setState({ loading: true });
    await getCompanyListByPch(currentGroup[0].name, currentUser);
    this.setState({ loading: false });
  }

  /**
   * 导出企业信息列表
   * @memberof CompanyData
   */
  @autobind
  async exportCompanyListByPch() {
    const { exportCompanyListByPch } = this.props.store;
    const { currentUser, currentGroup } = this.props.userStore;
    this.setState({ downLoading: true });
    if (
      !(await exportCompanyListByPch(currentGroup[0].name, currentUser)).length
    ) {
      message.error("没有可以导出的数据");
    }
    this.setState({ downLoading: false });
  }

  /**
   * 编辑企业信息
   * @memberof CompanyData
   */
  @autobind
  updateCompanyInfoByPch() {
    const { form } = this.companyDataForm.props;
    const { company_mj_lands } = this.companyDataForm.state;
    const { updateCompanyInfoByPch } = this.props.store;
    if (~company_mj_lands.map(v => v.uuid).indexOf(""))
      return message.error(
        "【租赁用地】企业统一信用代码/行政区划代码不可为空!"
      );
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      this.setState({ savingLoad: true });
      try {
        await updateCompanyInfoByPch(values, company_mj_lands);
        this.hideModal(COMPANY_DATA_FORM_HASH);
        message.info(`[${values.name}] 企业信息更新成功`);
        this.fetchList();
      } finally {
        this.setState({ savingLoad: false });
      }
    });
  }

  /**
   * 民用房确认提交
   * @memberof CompanyData
   */
  @autobind
  async updateCivilState(uuid) {
    const { updateCivilState } = this.props.store;
    Modal.confirm({
      title: "确认该企业民用房信息?",
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        try {
          await updateCivilState(uuid);
          message.success(`民用房信息确认成功!`);
          await this.fetchList();
        } catch (e) {
          message.error(e);
        } finally {
        }
      },
    });
  }

  /**
   * 更新企业登录密码
   * @memberof CompanyData
   */
  @autobind
  updateCompanyPassport() {
    const { form } = this.companyPassportForm.props;
    const { updateCompanyPassport } = this.props.store;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      this.setState({ savingLoad: true });
      try {
        await updateCompanyPassport(values);
        this.hideModal(COMPANY_PASSPORT_FORM_HASH);
        message.info(`[${values.name}] 登陆密码更新成功`);
      } finally {
        this.setState({ savingLoad: false });
      }
    });
  }

  /**
   * 搜索栏
   * @returns
   * @memberof CompanyData
   */
  @autobind
  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const {
      confirmOption,
      scaleOption,
      pchOption,
      loading,
      downLoading,
    } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>年度:</label>
          <Select
            defaultValue={_query.pch}
            style={{ width: "100px" }}
            onChange={val => {
              _query.pch = val;
            }}
          >
            {pchOption.map(item => (
              <Option value={item.key} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>企业名称:</label>
          <Input
            placeholder="输入企业名称"
            style={{ width: "180px" }}
            onChange={e => {
              _query.name = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>统一社会信用代码:</label>
          <Input
            placeholder="输入统一社会信用代码"
            style={{ width: "180px" }}
            onChange={e => {
              _query.uuid = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>确认状态:</label>
          <Select
            defaultValue={_query.isconfirm}
            style={{ width: "100px" }}
            onChange={val => {
              _query.isconfirm = val == 2 ? undefined : val;
            }}
          >
            {confirmOption.map(item => (
              <Option value={item.key} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
        </span>
        <span className="action-left-search-single">
          <label>企业规模:</label>
          <Select
            defaultValue={_query.scale}
            style={{ width: "100px" }}
            onChange={val => {
              _query.scale = val == 2 ? undefined : val;
            }}
          >
            {[{ key: 2, title: "全部" }, ...scaleOption].map(item => (
              <Option value={item.key} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
        </span>
        <Button
          type="primary"
          icon="search"
          loading={loading}
          onClick={() => {
            _pageQuery.page = 1;
            this.fetchList();
          }}
        >
          搜索
        </Button>
        <Button
          type="primary"
          icon="cloud-upload"
          loading={downLoading}
          onClick={this.exportCompanyListByPch}
        >
          数据导出
        </Button>
      </span>
    );
  }

  columns() {
    const { statusOption } = this.state;
    return [
      {
        title: "序号",
        dataIndex: "id",
        width: 60,
        fixed: "left",
        render: (t, r, index) => {
          return ++index;
        },
      },
      {
        title: "企业名称",
        width: 240,
        dataIndex: "name",
        fixed: "left",
        render: (t, r) => (
          <span>
            {t} {!r.disableConfirm ? <Tag color="green">已确认</Tag> : ""}{" "}
            {r.iscivil ? <Tag color="orange">民用房</Tag> : ""}
          </span>
        ),
      },
      {
        title: "统一社会信用代码",
        width: 180,
        dataIndex: "uuid",
        fixed: "left",
      },
      {
        title: "所在街道",
        width: 100,
        dataIndex: "street",
        fixed: "left",
      },
      {
        title: "联系人号码",
        width: 120,
        dataIndex: "linkphone",
        fixed: "left",
      },
      {
        title: "规模",
        dataIndex: "scale",
        fixed: "left",
        width: 60,
        render: t => (t ? "规上" : "规下"),
      },
      {
        title: "企业地址",
        width: 160,
        dataIndex: "address",
      },
      {
        title: "法人联系方式",
        width: 120,
        dataIndex: "legalphone",
      },
      {
        title: "企业状态",
        width: 170,
        dataIndex: "state",
        render: t => (
          <Tag color={t == 0 ? "cyan" : "red"}>
            {statusOption.filter(item => item.key == t)[0].title}
          </Tag>
        ),
      },
      {
        title: "自有用地(亩)",
        dataIndex: "landself",
        width: 80
      },
      {
        title: "出租用地(亩)",
        dataIndex: "landr",
        width: 80,
        render: (r, t) => (
          <span className={t.land_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "租赁用地(亩)",
        dataIndex: "landget",
        width: 80,
        render: (r, t) => (
          <span className={t.land_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "实际用地(亩)",
        dataIndex: "landd",
        width: 80,
        render: (r, t) => (
          <span className={t.land_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "用电数据(千瓦时)",
        dataIndex: "elecd",
        width: 80,
        render: (r, t) => (
          <span className={t.elec_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "实缴税金(万)",
        dataIndex: "tax",
        width: 120,
        render: (r, t) => <span className={t.tax_state ? "d" : "nd"}>{r}</span>,
      },
      {
        title: "主营业收入(万)",
        dataIndex: "revenue",
        width: 120,
        render: (r, t) => (
          <span className={t.revenue_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "工业增加值(万)",
        dataIndex: "industrial",
        width: 120,
        render: (r, t) => (
          <span className={t.industrial_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "综合能耗(吨标煤)",
        dataIndex: "energy",
        width: 80,
        render: (r, t) => (
          <span className={t.energy_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "研发经费(万)",
        dataIndex: "rde",
        width: 120,
        render: (r, t) => <span className={t.rde_state ? "d" : "nd"}>{r}</span>,
      },
      {
        title: "年平均员工(人)",
        dataIndex: "staff",
        width: 120,
        render: (r, t) => (
          <span className={t.staff_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "排污量(吨)",
        dataIndex: "sewage",
        width: 120,
        render: (r, t) => (
          <span className={t.sewage_state ? "d" : "nd"}>{r}</span>
        ),
      },
      {
        title: "操作",
        width: 280,
        fixed: "right",
        render: (t, r) => {
          return (
            <div className="operator">
              <Button
                type="primary"
                icon="edit"
                onClick={() => this.openModal(COMPANY_DATA_FORM_HASH, r)}
              >
                编辑
              </Button>
              {r.iscivil ? (
                <Button
                  type="primary"
                  disabled={r.civil_state}
                  onClick={() => this.updateCivilState(r.uuid)}
                >
                  民用房确认
                </Button>
              ) : undefined}
              <Button
                type="primary"
                onClick={() => this.openModal(COMPANY_PASSPORT_FORM_HASH, r)}
              >
                密码修改
              </Button>
            </div>
          );
        },
      },
    ].map(v => {
      return { ...v, key: v.dataIndex };
    });
  }

  render() {
    const {
      loading,
      savingLoad,
      formModalVisiable,
      passportModalVisiable,
      edit,
      statusOption,
      scrolly,
    } = this.state;
    const { list, _pageQuery } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <div id="flex-ant-table">
          {scrolly ? (
            <Table
              dataSource={toJS(list)}
              columns={this.columns()}
              rowKey={r => r.uuid}
              scroll={{
                x: 2300,
                y: scrolly,
              }}
              pagination={{
                current: _pageQuery.page,
                total: _pageQuery.count,
                pageSize: _pageQuery.pageSize,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                  _pageQuery.pageSize = pageSize;
                  _pageQuery.page = 1;
                  this.fetchList();
                },
                onChange: current => {
                  _pageQuery.page = current;
                  this.fetchList();
                },
                showTotal: () => {
                  return "共 " + _pageQuery.count + " 条数据";
                },
              }}
              loading={loading}
            />
          ) : undefined}
        </div>
        <Modal
          className="modal-handled"
          title={"企业数据审核"}
          width={1200}
          destroyOnClose={true}
          visible={formModalVisiable}
          onCancel={() => this.hideModal(COMPANY_DATA_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(COMPANY_DATA_FORM_HASH)}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.updateCompanyInfoByPch}
            >
              保存
            </Button>,
          ]}
        >
          <CompanyDataForm
            company={edit || {}}
            status={statusOption}
            fetchCompanyNameByUuid={this.props.store.fetchCompanyNameByUuid}
            wrappedComponentRef={instance => {
              this.companyDataForm = instance;
            }}
          />
        </Modal>
        <Modal
          className="update-password-modal"
          title="企业密码修改"
          visible={passportModalVisiable}
          width={400}
          destroyOnClose={true}
          onCancel={() => this.hideModal(COMPANY_PASSPORT_FORM_HASH)}
          footer={[
            <Button
              key="back"
              onClick={() => this.hideModal(COMPANY_PASSPORT_FORM_HASH)}
            >
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.updateCompanyPassport}
            >
              提交
            </Button>,
          ]}
        >
          <CompanyPassportForm
            wrappedComponentRef={instance => {
              this.companyPassportForm = instance;
            }}
            company={edit || {}}
          />
        </Modal>
      </div>
    );
  }
}
