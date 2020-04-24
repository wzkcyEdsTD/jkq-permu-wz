const { Controller } = require('egg');
const _ = require('lodash');

class GroupController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.GroupService = ctx.service.groupService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 通过用户id获取菜单
   * @存入session
   */
  async getGroupSession() {
    const params = this.ctx.query;
    const res = await this.GroupService.fetchGroupByUser(params.userid);
    this.ctx.body = res;
  }

  /**
   * 菜单列表
   */
  async index() {
    const query = this.ctx.query;
    const res = await this.GroupService.fetchGroupList(query);
    this.ctx.body = res;
  }

  /**
   * 获取用户组全部option
   */
  async getGroupOption() {
    const res = await this.GroupService.fetchGroupOption();
    this.ctx.body = res;
  }

  /**
   * 更新用户组
   */
  async update() {
    const { ctx, GroupService } = this;
    const rules = {
      name: 'string',
      menuIdList: 'array'
    };
    const group = {
      id: ctx.params.id,
      ..._.pick(ctx.request.body, ['name', 'menuIdList'])
    };
    ctx.validate(rules, group);
    const response = await GroupService.updateGroup(group);
    ctx.body = response;
  }

  /**
   * 创建用户组
   */
  async create() {
    const { ctx, GroupService } = this;
    const rules = {
      name: 'string',
      menuIdList: 'array'
    };
    const group = {
      ..._.pick(ctx.request.body, ['name', 'menuIdList'])
    };

    ctx.validate(rules, group);

    const response = await GroupService.createGroup(group);

    ctx.body = response;
  }
}

module.exports = GroupController;
