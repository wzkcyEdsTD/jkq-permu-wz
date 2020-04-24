const Service = require('egg').Service;
const _ = require('lodash');

class GroupService extends Service {
  constructor(ctx) {
    super(ctx);
    this.GroupModel = ctx.model.GroupModel;
    this.GroupMenuRelation = ctx.model.GroupMenuRelation;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async fetchGroupByUser(id) {
    try {
      const group = await this.GroupModel.findAll({
        include: [
          {
            model: this.app.model.UserModel,
            through: {
              attributes: ['group_users', 'user_groups']
            },
            where: {
              id
            }
          }
        ]
      });

      return this.ServerResponse.createBySuccessData({
        group
      });
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('获取用户列表失败');
    }
  }

  async fetchGroupList({ page = 1, pageSize = 10 }) {
    try {
      const { count, rows } = await this.GroupModel.findAndCountAll({
        include: [
          {
            model: this.app.model.MenuModel,
            through: {
              attributes: ['group_menus', 'menu_groups']
            }
          }
        ],
        distinct: true,
        order: [['id', 'ASC']],
        limit: Number(pageSize || 0),
        offset: Number(page - 1 || 0) * Number(pageSize || 0)
      });

      if (rows.length < 1) {
        this.ServerResponse.createBySuccessMsg('无数据');
      }
      rows.forEach(row => row && row.toJSON());

      return this.ServerResponse.createBySuccessData({
        page: {
          page: +page,
          pageSize: +pageSize,
          total: count
        },
        list: rows
      });
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('获取用户组列表失败');
    }
  }

  async fetchGroupOption() {
    try {
      const groups = await this.GroupModel.findAll();
      return this.ServerResponse.createBySuccessData(groups);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg('获取用户组列表失败');
    }
  }

  async updateGroup(group) {
    const errorMsg = '保存用户组失败';
    const { name, id } = group;
    const [rowCount] = await this.GroupModel.update(
      { name },
      {
        where: { id }
      }
    );
    try {
      await this.GroupMenuRelation.destroy({
        where: { group_menus: id }
      });
      await this.GroupMenuRelation.bulkCreate(
        group.menuIdList.map(v => {
          return { group_menus: id, menu_groups: v };
        })
      );
      return this.ServerResponse.createBySuccessMsgAndData(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, group, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async createGroup(group) {
    const errorMsg = '创建用户组失败';
    const { name, menuIdList } = group;

    try {
      group = await this.GroupModel.create({
        name,
        isActive: 1
      });
      if (group) {
        group = group.toJSON();
        await this.GroupMenuRelation.bulkCreate(
          menuIdList.map(v => {
            return { group_menus: group.id, menu_groups: v };
          })
        );
        return this.ServerResponse.createBySuccessMsgAndData(
          '创建用户组成功',
          group
        );
      }
      return this.ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, group, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }
}

module.exports = GroupService;
