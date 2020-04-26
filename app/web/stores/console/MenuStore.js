import { action, observable, computed } from 'mobx';

import MenuAPI from 'api/menu';
import GroupAPI from 'api/group';

const initTable = {
  sortedInfo: {} //  排序状态
};

const initPage = {
  page: 1,
  pageSize: 20,
  total: undefined,
  totalPage: undefined
};

class MenuStore {
  constructor(ctx, initialState) {
    this.MenuAPI = new MenuAPI(ctx);
    this.GroupAPI = new GroupAPI(ctx);
  }

  //  菜单列表
  @observable
  _menuList = [];
  @computed.struct
  get menuList() {
    return this._menuList;
  }

  @observable
  pageRequest = initPage;

  @observable
  tableParams = initTable;

  @action
  reset() {
    this.pageRequest = initPage;
    this.tableParams = initTable;
  }

  @action
  fetchMenuList = async params => {
    const sort = JSON.parse(JSON.stringify(this.tableParams.sortedInfo));
    if (sort.columnKey) {
      sort.order =
        sort.order == 'ascend' ? 'ASC' : sort.order == 'descend' ? 'DESC' : '';
    }
    const { list, page } = await this.MenuAPI.fetchMenuList({
      ...{ sort },
      ...this.pageRequest
    });
    this._menuList = list;
    this.pageRequest = page;
    return list;
  };

  @action
  fetchMenuOption = async params => {
    const rmenu = await this.MenuAPI.fetchMenuOption();
    return rmenu.menus;
  };

  @action
  fetchMenuAll = async params => {
    const menu = await this.MenuAPI.fetchMenuAll();
    return menu;
  };

  @action
  fetchBasicOption = async params => {
    const rgroup = await this.GroupAPI.fetchGroupOption();
    return { rgroup };
  };

  @action
  saveMenu = async menu => {
    if (menu.id) {
      const result = await this.MenuAPI.updateMenu(menu);
    } else {
      const result = await this.MenuAPI.createMenu(menu);
    }
  };

  @action
  saveMenuStore = async menuStore => {
    const result = await this.MenuAPI.saveMenuStore(menuStore);
  };
}

export default MenuStore;
