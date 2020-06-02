import React, { Component } from "react";
import autobind from "autobind-decorator";
import { Table, Modal, Tag, Icon, Tabs, Button, message } from "antd";
const TabPane = Tabs.TabPane;
import { observer, inject } from "mobx-react";
import { toJS } from "mobx";
import MenuTree from "./components/MenuTree";
import "./MenuManagement.less";

import MenuForm, {
  MENU_FORM_MODE_ADD,
  MENU_FORM_MODE_UPDATE,
} from "./components/MenuForm";
import hoc from "components/HOC/pageHeader";

@inject(stores => ({
  store: stores.menuStore,
}))
@hoc({ name: "菜单管理", className: "page_menuManagement" })
@observer
class MenuManagement extends Component {
  state = {
    loading: false,
    menuFormModalVisiable: false,
    menuFormMode: MENU_FORM_MODE_ADD,
    groups: null,
    savingLoad: false,
    editedMenu: null,
    treeTabAvailable: false,
  };

  componentDidMount() {
    this.refreshMenuTableData();
  }

  async getBasicOption() {
    //  是否有options数据
    const { groups } = this.state;
    const { fetchBasicOption } = this.props.store;
    if (groups) {
      return;
    } else {
      const { rgroup } = await fetchBasicOption();
      this.setState({ groups: rgroup });
      return;
    }
  }

  @autobind
  onMenuSave() {
    const { menuFormMode, editedMenu } = this.state;
    const { store } = this.props;
    const { form } = this.menuForm.props;
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) {
        return;
      }
      this.setState({ savingLoad: true });
      try {
        await store.saveMenu(values);
        this.hideMenuFormModal();
        message.success(
          `${menuFormMode === MENU_FORM_MODE_ADD ? "添加" : "更新"}菜单【${
            values.label
          }】成功`
        );
      } finally {
        this.setState({ savingLoad: false });
      }
      this.refreshMenuTableData();
      //  更新后 也更新MenuTree的状态
      if (this.myRef) {
        this.myRef.wrappedInstance.doFilteMenuTree();
      }
    });
  }

  @autobind
  async showMenuFormModal(menu) {
    await this.getBasicOption();
    if (menu && menu.id) {
      this.setState({
        menuFormModalVisiable: true,
        menuFormMode: MENU_FORM_MODE_UPDATE,
        editedMenu: menu,
      });
    } else {
      this.setState({ menuFormModalVisiable: true });
    }
  }

  @autobind
  hideMenuFormModal() {
    this.setState({
      menuFormModalVisiable: false,
      menuFormMode: MENU_FORM_MODE_ADD,
      editedMenu: null,
    });
  }

  getColumnsMenu() {
    const { sortedInfo } = this.props.store.tableParams;
    const cols = [
      {
        title: "编号",
        dataIndex: "id",
        sortOrder: sortedInfo.columnKey === "id" && sortedInfo.order,
        sorter: (a, b) => {},
      },
      {
        title: "菜单名称",
        dataIndex: "label",
        sortOrder: sortedInfo.columnKey === "label" && sortedInfo.order,
        sorter: (a, b) => {},
      },
      {
        title: "已授权用户组",
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
        title: "链接地址",
        dataIndex: "p_link",
        sortOrder: sortedInfo.columnKey === "p_link" && sortedInfo.order,
        sorter: (a, b) => {},
      },
      {
        title: "图标",
        dataIndex: "anticon",
        render: t => {
          return <Icon type={t} />;
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
                onClick={() => this.showMenuFormModal(r)}
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
  async refreshMenuTableData() {
    const { store } = this.props;
    this.setState({ loading: true });
    try {
      const list = await store.fetchMenuList();
    } finally {
      this.setState({
        loading: false,
        treeTabAvailable: true,
      });
    }
  }

  render() {
    const {
      menuFormMode,
      menuFormModalVisiable,
      editedMenu,
      savingLoad,
      loading,
      groups,
      treeTabAvailable,
    } = this.state;

    const { menuList, pageRequest, tableParams } = this.props.store;

    return (
      <div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="菜单列表" key="1">
            <div className="action-container">
              <span className="action-right-button">
                <Button
                  type="primary"
                  icon="plus"
                  onClick={this.showMenuFormModal}
                >
                  新增菜单
                </Button>
              </span>
            </div>
            <Table
              dataSource={toJS(menuList)}
              columns={this.getColumnsMenu()}
              rowKey={r => r.id}
              pagination={{
                total: pageRequest.total,
                pageSize: pageRequest.pageSize,
                showSizeChanger: true,
                onShowSizeChange: (current, pageSize) => {
                  pageRequest.pageSize = pageSize;
                  this.refreshMenuTableData();
                },
                onChange: current => {
                  pageRequest.page = current;
                  this.refreshMenuTableData();
                },
                showTotal: () => {
                  return "共 " + pageRequest.total + " 条数据";
                },
              }}
              onChange={(pagination, filters, sorter) => {
                tableParams.sortedInfo = sorter;
                this.refreshMenuTableData();
              }}
              loading={loading}
            />
            <Modal
              className="modal-menu"
              title={`${
                menuFormMode === MENU_FORM_MODE_ADD ? "新增" : "编辑"
              }菜单`}
              width={700}
              destroyOnClose={true}
              visible={menuFormModalVisiable}
              onCancel={this.hideMenuFormModal}
              footer={[
                <Button key="back" onClick={this.hideMenuFormModal}>
                  取消
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={savingLoad}
                  onClick={this.onMenuSave}
                >
                  保存
                </Button>,
              ]}
            >
              <MenuForm
                menu={editedMenu}
                mode={menuFormMode}
                groups={groups}
                wrappedComponentRef={instance => {
                  this.menuForm = instance;
                }}
              />
            </Modal>
          </TabPane>
          {treeTabAvailable ? (
            <TabPane tab="菜单排序" key="2">
              <MenuTree
                ref={inst => {
                  this.myRef = inst;
                }}
              />
            </TabPane>
          ) : (
            <TabPane tab="菜单排序" disabled key="2" />
          )}
        </Tabs>
      </div>
    );
  }
}

export default MenuManagement;
