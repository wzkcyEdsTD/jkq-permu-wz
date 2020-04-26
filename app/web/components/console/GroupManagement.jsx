import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Button, Switch, Table, Modal, Tag, message } from "antd";
import { observer, inject } from "mobx-react";
import { toJS, decorate } from "mobx";
import moment from "moment";

import GroupForm, {
  GROUP_FORM_MODE_ADD,
  GROUP_FORM_MODE_UPDATE,
} from "./components/GroupForm";
import hoc from "components/HOC/pageHeader";

@hoc({ name: "用户组管理", className: "page_groupManagement" })
@inject((stores) => ({
  store: stores.groupStore,
}))
@observer
class GroupManagement extends Component {
  state = {
    loading: false,
    groupFormModalVisiable: false,
    groupFormMode: GROUP_FORM_MODE_ADD,
    menus: null,
    savingLoad: false,
    editedGroup: null,
  };

  componentDidMount() {
    this.refreshGroupTableData();
  }

  async getBasicOption() {
    //  是否有options数据
    const { menus } = this.state;
    const { fetchBasicOption } = this.props.store;
    if (menus) {
      return;
    } else {
      const { rmenu } = await fetchBasicOption();
      this.setState({ menus: rmenu.menus });
      return;
    }
  }

  @autobind
  onGroupSave() {
    const { groupFormMode, editedGroup } = this.state;
    const { store } = this.props;
    const { form } = this.groupForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        values.menuIdList = values.menuIdList
          ? values.menuIdList.split("@").map((v) => {
              return +v;
            })
          : [];
        console.log(values.menuIdList);
        await store.saveGroup(values);
        this.hideGroupFormModal();
        message.success(
          `${groupFormMode === GROUP_FORM_MODE_ADD ? "添加" : "更新"}用户组【${
            values.name
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.refreshGroupTableData();
    });
  }

  @autobind
  async showGroupFormModal(group) {
    await this.getBasicOption();
    if (group && group.id) {
      this.setState({
        groupFormModalVisiable: true,
        groupFormMode: GROUP_FORM_MODE_UPDATE,
        editedGroup: group,
      });
    } else {
      this.setState({ groupFormModalVisiable: true });
    }
  }

  @autobind
  hideGroupFormModal() {
    this.setState({
      groupFormModalVisiable: false,
      groupFormMode: GROUP_FORM_MODE_ADD,
      editedGroup: null,
    });
  }

  getColumnsGroup() {
    const cols = [
      {
        title: "编号",
        width: 60,
        dataIndex: "id",
      },
      {
        title: "用户组",
        width: 120,
        dataIndex: "name",
      },
      {
        title: "菜单权限",
        dataIndex: "phone",
        render: (t, r) => {
          return r.menus.map((v, index) => {
            return (
              <Tag color={v.isAdminOnly == 1 ? "red" : "cyan"} key={index}>
                {v.label}
              </Tag>
            );
          });
        },
      },
      {
        title: "操作",
        render: (t, r) => {
          return (
            <div className="operator">
              <Button
                type="primary"
                icon="edit"
                onClick={() => this.showGroupFormModal(r)}
              >
                编辑
              </Button>
            </div>
          );
        },
      },
    ];
    return cols;
  }

  @autobind
  async refreshGroupTableData() {
    const { store } = this.props;
    this.setState({ loading: true });
    try {
      const list = await store.fetchGroupList();
    } finally {
      this.setState({ loading: false });
    }
  }

  render() {
    const {
      groupFormMode,
      groupFormModalVisiable,
      editedGroup,
      savingLoad,
      loading,
      menus,
    } = this.state;

    const { groupList, pageRequest } = this.props.store;

    return (
      <div>
        <div className="action-container">
          <span className="action-right-button">
            <Button
              type="primary"
              icon="plus"
              onClick={this.showGroupFormModal}
            >
              新增用户组
            </Button>
          </span>
        </div>
        <Table
          dataSource={toJS(groupList)}
          columns={this.getColumnsGroup()}
          rowKey={(r) => r.id}
          pagination={{
            total: pageRequest.total,
            pageSize: pageRequest.pageSize,
            showSizeChanger: true,
            onShowSizeChange: (current, pageSize) => {
              pageRequest.pageSize = pageSize;
              this.refreshGroupTableData();
            },
            onChange: (current) => {
              pageRequest.page = current;
              this.refreshGroupTableData();
            },
            showTotal: () => {
              return "共 " + pageRequest.total + " 条数据";
            },
          }}
          loading={loading}
        />
        <Modal
          className="modal-group"
          title={`${
            groupFormMode === GROUP_FORM_MODE_ADD ? "新增" : "编辑"
          }用户组`}
          width={700}
          destroyOnClose={true}
          visible={groupFormModalVisiable}
          onCancel={this.hideGroupFormModal}
          footer={[
            <Button key="back" onClick={this.hideGroupFormModal}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={savingLoad}
              onClick={this.onGroupSave}
            >
              保存
            </Button>,
          ]}
        >
          <GroupForm
            group={editedGroup}
            mode={groupFormMode}
            menus={menus}
            wrappedComponentRef={(instance) => {
              this.groupForm = instance;
            }}
          />
        </Modal>
      </div>
    );
  }
}

export default GroupManagement;
