const Controller = require("egg").Controller;
const _ = require("lodash");
const Role = require("../../enum/Role");
const DEFAULT_PASSWORD = "123456";

class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.UserModel = ctx.model.UserModel;
    this.UserService = ctx.service.userService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  // 登录
  async login() {
    const { username, password } = this.ctx.request.body;
    const response = await this.UserService.login(username, password);
    if (response.isSuccess() && response.data) {
      this.ctx.session.currentUser = response.getData();
    }
    this.ctx.body = response;
  }

  // 登出
  async logout() {
    this.ctx.session = null;
    this.ctx.body = this.ServerResponse.createBySuccess();
  }

  // 获取用户信息
  async getUserSession() {
    const { ctx, session, ServerResponse } = this;
    const user = this.ctx.session.currentUser;
    let response;
    if (user) {
      response = ServerResponse.createBySuccessData(user);
    } else {
      ctx.status = 401;
      response = ServerResponse.createByErrorMsg("用户未登录");
    }
    ctx.body = response;
  }

  // 注册
  async register() {
    const user = this.ctx.request.body;
    const respponse = await this.UserService.register(user);
    this.ctx.body = respponse;
  }

  // 校验
  async checkValid() {
    const { value, type } = this.ctx.params;
    const response = await this.UserService.checkValid(type, value);
    this.ctx.body = response;
  }

  // 登录状态的重置密码
  async resetPassword() {
    let response;
    const { passwordOld, passwordNew } = this.ctx.request.body;
    const user = this.session.currentUser;
    if (!user) response = this.ServerResponse.createByErrorMsg("用户未登录");
    else
      response = await this.UserService.resetPassword(
        passwordOld,
        passwordNew,
        user
      );
    this.ctx.body = response;
  }

  async adminResetPassword() {
    const { userId, password } = this.ctx.request.body;
    const response = await this.UserService.adminResetPassword(
      userId,
      password
    );
    //  清除登录信息
    // await this.app.sessionStore.cancel(userId);
    this.ctx.body = response;
  }

  async show() {
    const { ctx } = this;
    const userId = ctx.params.userId;
    const response = await this.UserService.getUser(userId);
    ctx.body = response;
  }

  async index() {
    const query = this.ctx.query;
    const res = await this.UserService.fetchUserList(query);
    this.ctx.body = res;
  }

  async create() {
    const { ctx, UserService } = this;
    const rules = {
      // department: "int",
      group: "array",
      // job: "array",
      isActive: "int",
      username: "string",
      // phone: "string",
    };
    const user = {
      ..._.pick(ctx.request.body, [
        "department",
        "group",
        "job",
        "isActive",
        "username",
        "phone",
      ]),
    };

    ctx.validate(rules, user);

    if (!user.password) {
      user.password = DEFAULT_PASSWORD;
    }

    const response = await UserService.createUser(ctx, user);
    ctx.body = response;
  }

  async update() {
    const { ctx, UserService } = this;
    const rules = {
      // department: "int",
      group: "array",
      // job: "array",
      isActive: "int",
    };
    const user = {
      id: ctx.params.userId,
      ..._.pick(ctx.request.body, ["department", "group", "job", "isActive"]),
    };
    ctx.validate(rules, user);

    //  若用户被屏蔽 清除登录信息
    if (user.isActive == 0) {
      // await this.app.sessionStore.cancel(user.id);
    }
    const response = await UserService.updateUser(user);
    ctx.body = response;
  }

  async delete() {
    const { userId } = this.ctx.params;
    const res = await this.UserService.deleteUser(userId);
    this.ctx.body = res;
  }

  async updateToAdmin() {
    const { userId } = this.ctx.params;
    const response = await this.UserService.updateToAdmin(userId);
    this.ctx.body = response;
  }

  async getJobOption() {
    const response = await this.UserService.fetchJobOption();
    this.ctx.body = response;
  }

  async getDepartmentOption() {
    const response = await this.UserService.fetchDepartmentOption();
    this.ctx.body = response;
  }
}

module.exports = UserController;
