import React, { Component } from "react";
import { observer } from "mobx-react";

@observer
export default class CompanyUploadEL extends Component {
  render() {
    const { companyland, companyelec, savingLoad } = this.props;
    return <div>用电用地数据</div>;
  }
}
