import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Button, Modal, Input, Select, message } from "antd";
import { observer, inject } from "mobx-react";
import hoc from "components/HOC/pageHeader";
import HandledForm, {
  HANDLED_FORM_MODE_ADD,
  HANDLED_FORM_MODE_UPDATE,
} from "./components/HandledForm";

@inject((stores) => ({
  store: stores.companyUploadStore,
}))
@hoc({ name: "企业数据上报核对 - 企业", className: "page_companydata" })
@observer
export default class CompanyData extends Component {
  state = {
    loading: false,
    savingLoad: false,
    formMode: HANDLED_FORM_MODE_ADD,
    edit: null,
  };

  componentWillMount() {}

  async componentDidMount() {
    await this.fetchCompanyOption();
  }

  @autobind
  async fetchCompanyOption() {}

  render() {
    const { loading, savingLoad, edit, formMode } = this.state;
    return (
      <div>
        <HandledForm
          handled={edit}
          mode={formMode}
          wrappedComponentRef={(instance) => {
            this.handledForm = instance;
          }}
        />
      </div>
    );
  }
}
