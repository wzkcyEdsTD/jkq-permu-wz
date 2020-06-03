const Service = require("egg").Service;
const md5 = require("md5");
const _ = require("lodash");
const { USERNAME, PHONE } = require("../common/type");

class UserService extends Service {
  constructor(ctx) {
    super(ctx);
    this.UserModel = ctx.model.UserModel;
    this.LoginLogModel = ctx.model.LoginLogModel;
    this.JobModel = ctx.model.JobModel;
    this.DepartmentModel = ctx.model.DepartmentModel;
    this.PassportModel = ctx.model.PassportModel;
    this.UserGroupRelation = ctx.model.UserGroupRelation;
    this.UserJobRelation = ctx.model.UserJobRelation;
    this.BusinessCode = ctx.response.BusinessCode;
    this.ServerResponse = ctx.response.ServerResponse;
    this.salt = ctx.app.config.salt;
  }

  /**
   *
   * @param field {String}
   * @param value {String}
   * @return {Promise.<boolean>}
   */
  async _checkExistColByField(field, value) {
    const data = await this.UserModel.findOne({
      attributes: [field],
      where: { [field]: value },
    });
    return !!data;
  }

  /**
   * @feature 校验 username phone
   * @param value {String}
   * @param type {String}
   * @return ServerResponse.msg
   */
  async checkLogValid(type, value) {
    if (type.trim()) {
      if (USERNAME === type) {
        return (await this._checkExistColByField(USERNAME, value))
          ? this.ServerResponse.createBySuccessMsg("用户名已存在")
          : this.ServerResponse.createByErrorMsg("用户名不存在");
      }
      if (PHONE === type) {
        return (await this._checkExistColByField(PHONE, value))
          ? this.ServerResponse.createBySuccessMsg("手机已存在")
          : this.ServerResponse.createByErrorMsg("手机不存在");
      }
    }
    return this.ServerResponse.createByErrorMsg("参数错误");
  }

  async checkRegValid(type, value) {
    if (type.trim()) {
      if (USERNAME === type) {
        return (await this._checkExistColByField(USERNAME, value))
          ? this.ServerResponse.createByErrorMsg("用户名已存在")
          : this.ServerResponse.createBySuccessMsg("用户名不存在");
      }
      if (PHONE === type) {
        return (await this._checkExistColByField(PHONE, value))
          ? this.ServerResponse.createByErrorMsg("手机已存在")
          : this.ServerResponse.createBySuccessMsg("手机不存在");
      }
    }
    return this.ServerResponse.createByErrorMsg("参数错误");
  }

  async login(username, password) {
    // 用户名存在报错
    const validResponse = await this.checkLogValid(USERNAME, username);
    if (!validResponse.isSuccess()) return validResponse;

    // 检查密码是否正确
    const user = await this.UserModel.findOne({
      include: [
        {
          model: this.app.model.PassportModel,
          where: {
            p_password: md5(password + this.salt),
          },
        },
      ],
      where: {
        username,
      },
    });
    if (!user) {
      return this.ServerResponse.createByErrorMsg("账号不存在或密码错误");
    }

    if (!user.get("isActive")) {
      return this.ServerResponse.createByErrorMsg("账号被禁用");
    }
    const userInfo = user.toJSON();
    const loginLog = await this.LoginLogModel.create({ username });
    return this.ServerResponse.createBySuccessMsgAndData("登录成功", userInfo);
  }

  async createUser(ctx, user) {
    const errorMsg = "新建用户失败";

    const validUsernameResponse = await this.checkRegValid(
      USERNAME,
      user.username
    );
    if (!validUsernameResponse.isSuccess()) {
      return validUsernameResponse;
    }
    // 手机号存在报错
    if (user.phone) {
      const validEmailResponse = await this.checkRegValid(PHONE, user.phone);
      if (!validEmailResponse.isSuccess()) return validEmailResponse;
    }

    user.password = md5(user.password + this.salt);

    const {
      username,
      phone,
      department,
      isActive,
      password,
      group,
      job,
      alias,
    } = user;
    try {
      user.password = md5(user.password + this.salt);
      user = await this.UserModel.create({
        username,
        phone,
        alias,
        department,
        isActive,
        role: "000",
      });
      if (user) {
        user = user.toJSON();
        await this.PassportModel.create({
          user: user.id,
          protocol: "local",
          password: password,
          p_password: password,
        });
        await this.UserGroupRelation.bulkCreate(
          group.map(v => {
            return { group_users: v, user_groups: user.id };
          })
        );
        job &&
          (await this.UserJobRelation.bulkCreate(
            job.map(v => {
              return { job_users: v, user_jobs: user.id };
            })
          ));
        return this.ServerResponse.createBySuccessMsgAndData(
          "创建用户成功",
          user
        );
      }
      return this.ServerResponse.createByErrorMsg(errorMsg);
    } catch (err) {
      _.unset(user, "password");
      this.app.logger.error(errorMsg, user, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  async updateUser(user) {
    const errorMsg = "保存用户失败";
    const { department, isActive, alias } = user;
    try {
      const [rowCount] = await this.UserModel.update(
        {
          // department,
          alias,
          isActive,
        },
        {
          where: { id: user.id },
        }
      );
      await this.UserGroupRelation.destroy({
        where: { user_groups: user.id },
      });
      await this.UserGroupRelation.bulkCreate(
        user.group.map(v => {
          return { group_users: v, user_groups: user.id };
        })
      );
      // await this.UserJobRelation.destroy({
      //   where: { user_jobs: user.id },
      // });
      // await this.UserJobRelation.bulkCreate(
      //   user.job.map((v) => {
      //     return { job_users: v, user_jobs: user.id };
      //   })
      // );
      return this.ServerResponse.createBySuccessMsgAndData(errorMsg);
    } catch (err) {
      this.app.logger.error(errorMsg, user, err);
      return this.ServerResponse.createByErrorMsg(errorMsg);
    }
  }

  /**
   * @feature 在线修改密码
   * @param passwordOld {String}
   * @param passwordNew {String}
   * @param currentUser {Object} [id]: 防止横向越权
   * @return ServerResponse
   */
  async resetPassword(passwordOld, passwordNew, currentUser) {
    const result = await this.PassportModel.findOne({
      where: { user: currentUser.id, p_password: md5(passwordOld + this.salt) },
    });
    if (!result) return this.ServerResponse.createByErrorMsg("旧密码错误");
    await this.PassportModel.update(
      {
        p_password: md5(passwordNew + this.salt),
      },
      { where: { user: currentUser.id }, individualHooks: true }
    );
    return this.ServerResponse.createBySuccessMsg("修改密码成功");
  }

  /**
   * 管理员修改密码
   * @param {INT} userId
   * @param {STRING} password
   */
  async adminResetPassword(userId, password) {
    await this.PassportModel.update(
      {
        p_password: md5(password + this.salt),
      },
      { where: { user: userId }, individualHooks: true }
    );
    return this.ServerResponse.createBySuccessMsg("修改密码成功");
  }

  /**
   * 获取用户信息(用户名)
   * @param {*} username
   * @returns
   * @memberof UserService
   */
  async getUserByUsername(username) {
    const user = await this.UserModel.findOne({
      where: { username },
    });
    return this.ServerResponse.createBySuccessData(user);
  }

  /**
   * 获取用户信息
   * @param {String} userId
   * @return {Promise.<void>}
   */
  async getUser(userId) {
    const user = await this.UserModel.findOne({
      include: [
        {
          model: this.app.model.PassportModel,
        },
      ],
      where: { id: userId },
    });
    if (!user) {
      return this.ServerResponse.createByErrorMsg("用户不存在");
    }

    return this.ServerResponse.createBySuccessData(user.toJSON());
  }

  /**
   * @Reconstruction 中间件
   * @featrue 后台管理校验管理员
   * @param user {Object}
   * @return {Promise.<ServerResponse>}
   */
  async checkAdminRole(user) {
    if (user && user.role === ROLE_ADMAIN)
      return this.ServerResponse.createBySuccess();
    return this.ServerResponse.createByError();
  }

  /**
   * @Reconstruction 中间件
   * @featrue 检查是否登录、是否为管理员
   * @return {Promise.<*>}
   */
  async checkAdminAndLogin(user) {
    const response = await this.checkAdminRole(user);
    if (!response.isSuccess()) {
      return this.ServerResponse.createByErrorMsg("无权限操作, 需要管理员权限");
    }
    return this.ServerResponse.createBySuccess();
  }

  async fetchUserList({ page = 1, pageSize = 10, username = "" }) {
    try {
      const { count, rows } = await this.UserModel.findAndCountAll({
        include: [
          // {
          //   model: this.app.model.DepartmentModel,
          // },
          // {
          //   model: this.app.model.JobModel,
          //   through: {
          //     attributes: ["job_users", "user_jobs"],
          //   },
          // },
          {
            model: this.app.model.GroupModel,
            through: {
              attributes: ["group_users", "user_groups"],
            },
          },
        ],
        distinct: true,
        order: [["id", "ASC"]],
        limit: Number(pageSize || 0),
        offset: Number(page - 1 || 0) * Number(pageSize || 0),
        where: {
          username: {
            $like: `%${username}%`,
          },
        },
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
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取用户列表失败");
    }
  }

  async deleteUser(userId) {
    try {
      const deleteCount = await this.UserModel.destroy({
        where: { id: userId },
      });
      if (deleteCount > 0) {
        return this.ServerResponse.createBySuccessMsgAndData("删除用户成功");
      }
      return this.ServerResponse.createByErrorMsg("用户不存在");
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("删除用户失败");
    }
  }

  async updateToAdmin(userId) {
    try {
      const [updateCount, [updateRow]] = await this.UserModel.update(
        { role: 1 },
        {
          where: { id: userId },
          individualHooks: true,
        }
      );

      if (updateCount > 0) {
        return this.ServerResponse.createBySuccessMsgAndData("更新角色成功");
      }
      return this.ServerResponse.createByErrorMsg("用户不存在");
    } catch (err) {
      return this.ServerResponse.createByError("更新角色失败");
    }
  }

  async fetchJobOption() {
    try {
      const jobs = await this.JobModel.findAll();
      return this.ServerResponse.createBySuccessData(jobs);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取工作岗位列表失败");
    }
  }

  async fetchDepartmentOption() {
    try {
      const department = await this.DepartmentModel.findAll();
      return this.ServerResponse.createBySuccessData(department);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取部门列表失败");
    }
  }
}

module.exports = UserService;
