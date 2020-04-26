import { action, observable, computed } from 'mobx';

import GroupAPI from 'api/group';
import MenuAPI from 'api/menu';

const initPage = {
  page: 1,
  pageSize: 10,
  total: undefined,
  totalPage: undefined
};

class GroupStore {
  constructor(ctx, initialState) {
    this.GroupAPI = new GroupAPI(ctx);
    this.MenuAPI = new MenuAPI(ctx);
  }

  @observable
  _groupList = [];
  @computed.struct
  get groupList() {
    return this._groupList;
  }

  @observable
  pageRequest = initPage;

  @action
  reset() {
    this.pageRequest = initPage;
  }

  @action
  fetchGroupList = async params => {
    const { list, page } = await this.GroupAPI.fetchGroupList({
      ...params,
      ...this.pageRequest
    });
    this._groupList = list;
    this.pageRequest = page;
    return list;
  };

  @action
  fetchBasicOption = async params => {
    const rmenu = await this.MenuAPI.fetchMenuOption();
    return { rmenu };
  };

  @action
  saveGroup = async group => {
    if (group.id) {
      const result = await this.GroupAPI.updateGroup(group);
    } else {
      const result = await this.GroupAPI.createGroup(group);
    }
  };
}

export default GroupStore;
