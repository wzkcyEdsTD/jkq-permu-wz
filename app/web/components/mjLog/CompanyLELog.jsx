import React, { Component } from "react";
import autobind from "autobind-decorator";
import { toJS } from "mobx";
import { Table } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";

@inject(stores => ({
  store: stores.companyLogStore,
}))
@hoc({ name: "用地用电凭证上传日志", className: "page_companylelog" })
@observer
export default class CompanyLELog extends Component {
  state = {
    loading: false,
  };

  columns = [
    { title: "序号", dataIndex: "id", render: (t, r, index) => ++index },
    { title: "企业信用代码", dataIndex: "uuid", key: "uuid" },
    { title: "文件名称", dataIndex: "filename", key: "filename" },
    {
      title: "文件路径",
      dataIndex: "fileurl",
      key: "fileurl",
      render: (t, r) => (
        <a href={`${window.location.host}${t}`}>{r.filename}</a>
      ),
    },
    { title: "操作人", dataIndex: "operator", key: "operator" },
    {
      title: "记录时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: t => new Date().toLocaleString(),
    },
  ];

  async componentDidMount() {
    await this.fetchList();
  }

  /**
   * 获取企业凭证日志
   * @memberof CompanyLELog
   */
  @autobind
  async fetchList() {
    const { getCompanyEvidenceList } = this.props.store;
    this.setState({ loading: true });
    try {
      await getCompanyEvidenceList();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const { loading } = this.state;
    const { leList, _pageQuery } = this.props.store;

    return (
      <div>
        <Table
          dataSource={toJS(leList)}
          columns={this.columns}
          rowKey={r => r.uuid}
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
