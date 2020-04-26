import { action, observable, computed } from "mobx";

import UserAPI from "api/user";
import GroupAPI from "api/group";
import MenuAPI from "api/menu";

const initTable = {
  searchParams: {
    search_username: undefined,
  },
};

const initPage = {
  page: 1,
  pageSize: 40,
  total: undefined,
  totalPage: undefined,
};

class UserStore {
  constructor(ctx, initialState, userinfoState) {
    this.userAPI = new UserAPI(ctx);
    this.MenuAPI = new MenuAPI(ctx);
    this.GroupAPI = new GroupAPI(ctx);

    if (userinfoState && userinfoState[0]) {
      const { user, menus, group } = userinfoState[0];
      this.currentUser = user;
      this.currentMenu = menus.menus;
      this.currentGroup = group.group;
    }
  }

  @observable
  _userList = [];
  @computed.struct
  get userList() {
    return this._userList;
  }
  @observable
  currentUser = null;
  @observable
  currentMenu = null;
  @observable
  currentGroup = null;

  //  分页
  @observable
  pageRequest = initPage;

  //  table字段
  @observable
  tableParams = initTable;

  @action
  reset() {
    this.pageRequest = initPage;
    this.tableParams = initTable;
  }

  @action
  login = async (params) => {
    const result = await this.userAPI.login(params);
    return result;
  };

  logout() {
    return this.userAPI.logout();
  }

  @action
  fetchUserSession = async () => {
    const user = await this.userAPI.getUserSession();
    this.currentUser = user;
    const group = await this.GroupAPI.getGroup({ userid: user.id });
    this.currentGroup = group;
    const menus = await this.MenuAPI.getMenu({ group });
    this.currentMenu = menus.menus;
    // console.log(user, group, menus)
    return { user, group, menus };
  };

  @action
  fetchUserList = async (params) => {
    const result = await this.userAPI.fetchUserList({
      username: this.tableParams.searchParams.search_username,
      ...this.pageRequest,
    });
    this._userList = result.list;
    this.pageRequest = result.page;
    return result.list;
  };

  @action
  register = async (params) => {
    const result = await this.userAPI.register(params);
    return result;
  };

  saveUser(_user) {
    const user = {
      ..._user,
      // phone: parseInt(_user.phone),
      department: _user.department || 0,
    };
    if (user.id) {
      return this.userAPI.updateUser(user);
    } else {
      return this.userAPI.createUser(user);
    }
  }

  @action
  updatePassword = async (params) => {
    const result = await this.userAPI.updatePassword({
      ...params,
      userId: this.currentUser.id,
    });
    return result;
  };

  @action
  adminUpdatePassword = async (params) => {
    const result = await this.userAPI.adminUpdatePassword(params);
    return result;
  };

  @action
  updateToAdmin = async (userId) => {
    const result = await this.userAPI.updateToAdmin(userId);
    return result;
  };

  @action
  fetchUserInfo = async (userId) => {
    const result = await this.userAPI.fetchUserInfo(userId);
    return result;
  };

  //console
  @action
  fetchBasicOption = async (params) => {
    const rgroup = await this.GroupAPI.fetchGroupOption();
    const rjob = await this.userAPI.fetchJobOption();
    const rdepartment = await this.userAPI.fetchDepartmentOption();
    return { rgroup, rjob, rdepartment };
  };
}

export default UserStore;
