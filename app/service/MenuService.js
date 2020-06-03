const Service = require("egg").Service;
const _ = require("lodash");

class MenuService extends Service {
  constructor(ctx) {
    super(ctx);
    this.MenustoreModel = ctx.model.MenustoreModel;
    this.MenuModel = ctx.model.MenuModel;
    this.GroupMenuRelation = ctx.model.GroupMenuRelation;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 根据用户组下发相应权限菜单
   * @param {Array} group
   */
  async fetchMenuByGroup(group) {
    try {
      const menu = await this.MenuModel.findAll({
        include: [
          {
            model: this.app.model.GroupModel,
            through: {
              attributes: ["group_menus", "menu_groups"],
            },
            where: {
              id: group.group.map(v => {
                return v.id;
              }),
            },
          },
        ],
      });

      return this.ServerResponse.createBySuccessData({
        menu,
      });
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取用户列表失败");
    }
  }

  /**
   * 菜单映射
   */
  async fetchMenuStore() {
    try {
      const menuStore = await this.MenustoreModel.findOne();
      return this.ServerResponse.createBySuccessData(menuStore.toJSON());
    } catch (error) {
      return this.ServerResponse.createBySuccessData({ menus: [] }.toJSON());
    }
  }

  /**
   * 获取全部菜单
   */
  async fetchMenuAll() {
    try {
      const menus = await this.MenuModel.findAll();
      return this.ServerResponse.createBySuccessData(menus);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取菜单列表失败");
    }
  }

  /**
   * 菜单列表
   */
  async fetchMenuList({ page = 1, pageSize = 10, sort }) {
    sort = JSON.parse(sort);
    //try {
    const { count, rows } = await this.MenuModel.findAndCountAll({
      include: [
        {
          model: this.app.model.GroupModel,
          through: {
            attributes: ["group_menus", "menu_groups"],
          },
        },
      ],
      distinct: true,
      order: [sort.columnKey ? [sort.columnKey, sort.order] : ["id", "ASC"]],
      limit: Number(pageSize || 0),
      offset: Number(page - 1 || 0) * Number(pageSize || 0),
    });

    if (rows.length < 1) {
      this.ServerResponse.createBySuccessMsg("无数据");
    }
    rows.forEach(row => row && row.toJSON());

    return this.ServerResponse.createBySuccessData({
      page: {
        page: +page,
        pageSize: +pageSize,
        total: count,
      },
      list: rows,
    });
    /*} catch (error) {
      return this.ServerResponse.createByErrorMsg('获取菜单列表失败');
    }*/
  }

  /**
   * 菜单选项列表
   */
  async fetchMenuOption() {
    try {
      const menus = await this.MenuModel.findAll();
      return this.ServerResponse.createBySuccessData(menus);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取菜单树失败");
    }
  }

  /**
   * 更新菜单
   * @param {Object} menu
   */
  async updateMenu(menu) {
    const errorMsg = "保存菜单失败";
    const { id, label, anticon, p_link, group } = menu;
    const [rowCount] = await this.MenuModel.update(
      {
        label,
        anticon,
        p_link,
      },
      {
        where: { id },
      }
    );
    try {
      await this.GroupMenuRelation.destroy({
        where: { menu_groups: id },
      });
      await this.GroupMenuRelation.bulkCreate(
        group.map(v => {
          return { group_menus: v, menu_groups: id };
        })
      );
      return this.ServerResponse.createBySuccessMsgAndData(
        "更新菜单成功",
        menu
      );
    } catch (err) {
      this.app.logger.error(errorMsg, menu, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  /**
   * 创建菜单
   * @param {Object} menu
   */
  async createMenu(menu) {
    const errorMsg = "创建菜单失败";
    const { label, anticon, p_link, group } = menu;

    try {
      menu = await this.MenuModel.create({
        label,
        anticon,
        p_link,
        //  以前的字段不为null,重构后不用
        link: p_link,
        isAdminOnly: 0,
        order: -1,
        level: 1,
      });
      if (menu) {
        menu = menu.toJSON();
        await this.GroupMenuRelation.bulkCreate(
          group.map(v => {
            return { group_menus: v, menu_groups: menu.id };
          })
        );
        return this.ServerResponse.createBySuccessMsgAndData(
          "创建菜单成功",
          menu
        );
      }
      return this.ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, menu, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  /**
   * 菜单映射
   * @param {INT} id
   * @param {Array} menuStore
   */
  async saveMenuStore({ id = 1, menuStore }) {
    const errorMsg = "更新菜单失败";
    if (menuStore.length) {
      try {
        menuStore = await this.MenustoreModel.update(
          {
            menus: menuStore,
          },
          {
            where: {
              id,
            },
          }
        );
        return this.ServerResponse.createBySuccessMsgAndData(
          "更新菜单成功",
          menuStore
        );
        return this.ServerResponse.createByErrorMsg(errorMsg);
      } catch (err) {
        this.app.logger.error(errorMsg, menuStore, err);
        return this.ServerResponse.createByErrorMsg(errorMsg);
      }
    } else {
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }
}

module.exports = MenuService;
