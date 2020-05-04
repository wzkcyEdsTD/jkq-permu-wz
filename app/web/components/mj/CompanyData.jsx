import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Button, Table, Modal, Input, Select, message, Tag } from "antd";
const { Option } = Select;
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import CompanyDataForm, {
  COMPANY_DATA_FORM_HASH,
} from "./components/CompanyDataForm";
import hoc from "components/HOC/pageHeader";
import "./CompanyData.less";

@inject((stores) => ({
  store: stores.companyDataStore,
}))
@hoc({ name: "企业数据审核 - 街道", className: "page_companydata" })
@observer
export default class CompanyData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formModalVisiable: false,
    passportModalVisiable: false,
    edit: null,
    statusOption: [
      { key: 0, title: "正常" },
      { key: 1, title: "非本街道" },
      { key: 2, title: "注销" },
      { key: 3, title: "迁出" },
      { key: 4, title: "迁入保护" },
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
  };

  async componentDidMount() {
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
    }
  }

  /**
   * 获取企业信息列表
   * @memberof CompanyData
   */
  @autobind
  async fetchList() {
    const { getCompanyListByPch } = this.props.store;
    this.setState({ loading: true });
    await getCompanyListByPch();
    this.setState({ loading: false });
  }

  /**
   * 编辑企业信息
   * @memberof CompanyData
   */
  @autobind
  saveCompanyData() {
    const { form } = this.companyDataForm.props;
    const { company_mj_elecs, company_mj_lands } = this.companyDataForm.state;
    const { updateCompanyInfoByPch } = this.props.store;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return;
      this.setState({ savingLoad: true });
      try {
        updateCompanyInfoByPch(values, company_mj_elecs, company_mj_lands);
        this.hideModal(COMPANY_DATA_FORM_HASH);
      } finally {
        this.setState({ savingLoad: false });
      }
    });
  }

  searchLeft() {
    const { _query, _pageQuery } = this.props.store;
    const { confirmOption, scaleOption, pchOption } = this.state;
    return (
      <span className="action-left-search">
        <span className="action-left-search-single">
          <label>年度:</label>
          <Select
            defaultValue={_query.pch}
            style={{ width: "100px" }}
            onChange={(val) => {
              _query.pch = val;
            }}
          >
            {pchOption.map((item) => (
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
            onChange={(e) => {
              _query.name = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>统一社会信用代码:</label>
          <Input
            placeholder="输入统一社会信用代码"
            style={{ width: "180px" }}
            onChange={(e) => {
              _query.uuid = e.target.value;
            }}
          />
        </span>
        <span className="action-left-search-single">
          <label>确认状态:</label>
          <Select
            defaultValue={_query.isconfirm}
            style={{ width: "100px" }}
            onChange={(val) => {
              _query.isconfirm = val == 2 ? undefined : val;
            }}
          >
            {confirmOption.map((item) => (
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
            onChange={(val) => {
              _query.scale = val == 2 ? undefined : val;
            }}
          >
            {[{ key: 2, title: "全部" }, ...scaleOption].map((item) => (
              <Option value={item.key} key={item.key}>
                {item.title}
              </Option>
            ))}
          </Select>
        </span>
        <Button
          type="primary"
          icon="search"
          onClick={() => {
            _pageQuery.page = 1;
            this.fetchList();
          }}
        >
          搜索
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
        title: "规模",
        dataIndex: "scale",
        fixed: "left",
        width: 60,
        render: (t) => (t ? "规上" : "规下"),
      },
      {
        title: "地址",
        width: 160,
        dataIndex: "address",
      },
      {
        title: "联系电话",
        width: 120,
        dataIndex: "legalphone",
      },
      {
        title: "企业状态",
        width: 100,
        dataIndex: "state",
        render: (t) => (
          <Tag color={t == 0 ? "cyan" : "red"}>
            {statusOption.filter((item) => item.key == t)[0].title}
          </Tag>
        ),
      },
      {
        title: "用地数据(平方米)",
        dataIndex: "landd",
        width: 80,
        render: ([normal, val]) =>
          normal ? val : <Tag color="red">{val}</Tag>,
      },
      {
        title: "用电数据(千瓦时)",
        dataIndex: "elecd",
        width: 80,
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
        title: "操作",
        width: 240,
        fixed: "right",
        render: (r, t) => {
          return (
            <div className="operator">
              <Button
                type="primary"
                icon="edit"
                onClick={() => this.openModal(COMPANY_DATA_FORM_HASH, t)}
              >
                编辑
              </Button>
              <Button
                type="primary"
                icon="check-circle"
                disabled={t.disableConfirm}
                onClick={() => {}}
              >
                确认
              </Button>
              <Button type="primary" icon="tool" onClick={() => {}}>
                密码修改
              </Button>
            </div>
          );
        },
      },
    ].map((v) => {
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
    } = this.state;
    const { list, _pageQuery } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={(r) => r.uuid}
          scroll={{ x: 1500 }}
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
            onChange: (current) => {
              _pageQuery.page = current;
              this.fetchList();
            },
            showTotal: () => {
              return "共 " + _pageQuery.count + " 条数据";
            },
          }}
          loading={loading}
        />
        <Modal
          className="modal-handled"
          title={"企业数据审核"}
          width={1000}
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
              onClick={this.saveCompanyData}
            >
              保存
            </Button>,
          ]}
        >
          <CompanyDataForm
            company={edit || {}}
            status={statusOption}
            wrappedComponentRef={(instance) => {
              this.companyDataForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}
