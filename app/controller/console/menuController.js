const { Controller } = require("egg");
const _ = require("lodash");
/**
 *
 * @param {*} _menu
 * @param {*} id
 */
const filtersMenu = (_menu, id) => {
  let menu = {};
  _menu.map((v) => {
    const val = v.dataValues;
    if (val.id == id) {
      menu = val;
    }
  });
  return menu;
};

const getMenuTree = (menuStore, _menu) => {
  const _menuStore = JSON.parse(menuStore.getData().menus);
  const _downloadMenu = [];
  for (let f in _menuStore) {
    let target_menu = filtersMenu(_menu, _menuStore[f].id);
    if (target_menu.p_link) {
      const f_menuStore = {
        id: target_menu.id,
        title: target_menu.label || "unknown",
        key: target_menu.p_link || "",
        anticon: target_menu.anticon || "",
        children: [],
      };
      if (_menuStore[f].children && _menuStore[f].children.length) {
        for (let s in _menuStore[f].children) {
          let target_children_menu = filtersMenu(
            _menu,
            _menuStore[f].children[s].id
          );
          if (target_children_menu.p_link) {
            f_menuStore.children.push({
              id: target_children_menu.id,
              title: target_children_menu.label || "unknown",
              anticon: target_children_menu.anticon || "",
              key: target_children_menu.p_link || "",
            });
          }
        }
      }
      _downloadMenu.push(f_menuStore);
    }
  }
  return _downloadMenu;
};

class MenuController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.MenuService = ctx.service.menuService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getMenuSession() {
    const params = this.ctx.request.body;
    const menu = await this.MenuService.fetchMenuByGroup(params.group);
    const menuStore = await this.MenuService.fetchMenuStore();
    const _menu = menu.getData().menu;
    const menus = getMenuTree(menuStore, _menu);
    this.ctx.session.menus = _menu;
    this.ctx.body = this.ServerResponse.createBySuccessData({ menus });
  }

  /**
   * 菜单列表
   */
  async index() {
    const query = this.ctx.query;
    const res = await this.MenuService.fetchMenuList(query);
    this.ctx.body = res;
  }

  async getMenuOption() {
    const menu = await this.MenuService.fetchMenuOption();
    const menuStore = await this.MenuService.fetchMenuStore();
    const _menu = menu.getData();
    const menus = getMenuTree(menuStore, _menu);
    this.ctx.body = this.ServerResponse.createBySuccessData({ menus });
  }

  async fetchMenuAll() {
    const menus = await this.MenuService.fetchMenuAll();
    this.ctx.body = menus;
  }

  /**
   * 更新菜单
   */
  async update() {
    const { ctx, MenuService } = this;
    const rules = {
      label: "string",
      anticon: "string",
      p_link: "string",
      group: "array",
    };
    const menu = {
      id: ctx.params.id,
      ..._.pick(ctx.request.body, ["label", "anticon", "p_link", "group"]),
    };
    ctx.validate(rules, menu);
    const response = await MenuService.updateMenu(menu);
    ctx.body = response;
  }

  /**
   * 创建菜单
   */
  async create() {
    const { ctx, MenuService } = this;
    const rules = {
      label: "string",
      anticon: "string",
      p_link: "string",
      group: "array",
    };
    const menu = {
      ..._.pick(ctx.request.body, ["label", "anticon", "p_link", "group"]),
    };
    ctx.validate(rules, menu);
    const response = await MenuService.createMenu(menu);
    ctx.body = response;
  }

  /**
   * 更新菜单映射
   */
  async saveMenuStore() {
    const { ctx, MenuService } = this;
    const menuStore = {
      id: ctx.params.id,
      ..._.pick(ctx.request.body, ["menuStore"]),
    };
    const response = await MenuService.saveMenuStore(menuStore);
    ctx.body = response;
  }
}

module.exports = MenuController;
