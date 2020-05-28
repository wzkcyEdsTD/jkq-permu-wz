import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Table } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";

@inject(stores => ({
  store: stores.companyLogStore,
}))
@hoc({ name: "企业数据更新日志", className: "page_companylog" })
@observer
export default class CompanyLog extends Component {
  state = {
    loading: false,
  };

  render() {
    return <div />;
  }
}
