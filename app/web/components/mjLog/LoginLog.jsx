import React, { Component } from "react";
import autobind from "autobind-decorator";
import { toJS } from "mobx";
import { Table, Tag } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";

@inject(stores => ({
  store: stores.companyLogStore,
}))
@hoc({ name: "登录日志", className: "page_loginlog" })
@observer
export default class LoginLog extends Component {
  state = {
    loading: false,
  };

  columns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "用户名", dataIndex: "username", key: "username" },
    { title: "别名", dataIndex: "alias", key: "alias" },
    {
      title: "用户组",
      dataIndex: "groups",
      render: t => {
        return t.map((v, index) => {
          return (
            <Tag color={v.name == "超级管理员" ? "red" : "cyan"} key={index}>
              {v.name}
            </Tag>
          );
        });
      },
    },
    {
      title: "登录时间",
      dataIndex: "createdAt",
      key: "createdAt",
      render: t => new Date(t).toLocaleString(),
    },
  ];

  async componentDidMount() {
    await this.fetchList();
  }

  /**
   * 登录日志列表
   * @memberof CompanyLELog
   */
  @autobind
  async fetchList() {
    const { getLoginLogList } = this.props.store;
    this.setState({ loading: true });
    try {
      await getLoginLogList();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    const { loginLogList, _pageQuery } = this.props.store;

    return (
      <div>
        <Table
          dataSource={toJS(loginLogList)}
          columns={this.columns}
          rowKey={r => r.id}
          pagination={{
            current: _pageQuery.page,
            total: _pageQuery.total,
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
              return "共 " + _pageQuery.total + " 条数据";
            },
          }}
          loading={loading}
        />
      </div>
    );
  }
}
