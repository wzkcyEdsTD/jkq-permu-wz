import React, { Component } from "react";
import moment from "moment";
import autobind from "autobind-decorator";
import { Button, Table, Modal, Input, Select, message, Tag } from "antd";
const { Option } = Select;
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import hoc from "components/HOC/pageHeader";

@inject((stores) => ({
  store: stores.companyDataStore,
}))
@hoc({ name: "企业数据审核 - 街道", className: "page_companyupload" })
@observer
export default class CompanyUpload extends Component {
  state = {
    loading: false,
    savingLoad: false,
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
      { key: 2, title: "全部" },
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

  @autobind
  async fetchList() {
    const { getCompanyListByPch } = this.props.store;
    this.setState({ loading: true });
    await getCompanyListByPch();
    this.setState({ loading: false });
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
            {scaleOption.map((item) => (
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
        width: 60,
        dataIndex: "id",
        render: (t, r, index) => {
          return ++index;
        },
      },
      {
        title: "企业名称",
        dataIndex: "name",
      },
      {
        title: "统一社会信用代码",
        dataIndex: "uuid",
      },
      {
        title: "所在街道",
        dataIndex: "street",
      },
      {
        title: "规模",
        dataIndex: "scale",
        render: (t) => (t ? "规上" : "规下"),
      },
      {
        title: "地址",
        dataIndex: "address",
      },
      {
        title: "企业状态",
        dataIndex: "state",
        render: (t) => (
          <Tag color={t == 0 ? "cyan" : "red"}>
            {statusOption.filter((item) => item.key == t)[0].title}
          </Tag>
        ),
      },
      {
        title: "操作",
        render: (t, r) => {
          return (
            <div className="operator">
              <Button type="primary" icon="edit" onClick={() => {}}>
                编辑
              </Button>
              <Button type="primary" icon="check-circle" onClick={() => {}}>
                确认
              </Button>
              <Button type="primary" icon="tool" onClick={() => {}}>
                密码修改
              </Button>
            </div>
          );
        },
      },
    ];
  }

  render() {
    const { loading } = this.state;
    const { list, _pageQuery } = this.props.store;
    return (
      <div>
        <div className="action-container">{this.searchLeft()}</div>
        <Table
          dataSource={toJS(list)}
          columns={this.columns()}
          rowKey={(r) => r.id}
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
      </div>
    );
  }
}
