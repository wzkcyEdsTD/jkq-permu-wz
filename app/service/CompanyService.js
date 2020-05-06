const Service = require("egg").Service;
const md5 = require("md5");
const shortid = require("shortid");
const _ = require("lodash");
const { USERNAME } = require("../common/type");

const PCH = "2019";
class CompanyService extends Service {
  constructor(ctx) {
    super(ctx);
    this.UserModel = ctx.model.UserModel;
    this.PassportModel = ctx.model.PassportModel;
    this.UserGroupRelation = ctx.model.UserGroupRelation;
    this.CompanyPchModel = ctx.model.CompanyPchModel;
    this.CompanyMjDataModel = ctx.model.CompanyMjDataModel;
    this.CompanyMjDataStateModel = ctx.model.CompanyMjDataStateModel;
    this.CompanyMjElecModel = ctx.model.CompanyMjElecModel;
    this.CompanyMjLandModel = ctx.model.CompanyMjLandModel;
    this.ServerResponse = ctx.response.ServerResponse;
    this.salt = ctx.app.config.salt;
  }

  /**
   * 获取企业列表(pch)
   * @param {*} params
   * @returns <ServerResponse>
   * @memberof CompanyService
   */
  async getCompanyListByPch(query) {
    const { street, page, pageSize, pch, name, uuid, isconfirm, scale } = query;
    const extra = {};
    (isconfirm || isconfirm == 0) && (extra.isconfirm = isconfirm);
    (scale || scale == 0) && (extra.scale = scale);
    try {
      const { count, rows } = await this.CompanyPchModel.findAndCountAll({
        attributes: [
          // "id", //  update for /home/companyData [CompanyDataForm]
          "name",
          "uuid",
          "street",
          "scale",
          "state",
          "address",
          "legalphone",
        ],
        where: {
          name: {
            $like: `%${name || ""}%`,
          },
          uuid: {
            $like: `%${uuid || ""}%`,
          },
          street: {
            $like: `%${street || ""}%`,
          },
          pch: pch || PCH,
          ...extra,
        },
        include: [
          {
            model: this.app.model.CompanyMjDataModel,
            attributes: [
              "tax",
              "revenue",
              "industrial",
              "energy",
              "rde",
              "staff",
            ],
            where: {
              pch: pch || PCH,
            },
            required: false,
          },
          {
            model: this.app.model.CompanyMjDataStateModel,
            attributes: [
              "tax",
              "revenue",
              "industrial",
              "energy",
              "rde",
              "staff",
            ],
            where: {
              pch: pch || PCH,
            },
            required: false,
          },
          {
            model: this.app.model.CompanyMjLandModel,
            attributes: ["id", "type", "area", "linktype", "uuid"],
            order: [["type", "DESC"]],
            // required: false,
          },
          {
            model: this.app.model.CompanyMjElecModel,
            attributes: ["id", "elecmeter", "elec"],
            // required: false,
          },
        ],
        order: [["scale", "DESC"]],
        limit: Number(pageSize || 10),
        offset: Number(page - 1 || 0) * Number(pageSize || 10),
      });
      rows.forEach((row) => row && row.toJSON());
      //  租赁信息
      const rent = await this.app.model.CompanyMjLandModel.findAll({
        where: {
          to_object: {
            $in: rows.map((v) => v.dataValues.uuid),
          },
          pch: pch || PCH,
          type: 0,
        },
      });
      rows.forEach(
        (row) =>
          (row.dataValues.company_mj_land_rent = rent.filter(
            (d) => d.uuid == row.dataValues.uuid
          ))
      );
      return this.ServerResponse.createBySuccessData({
        page: {
          page: +page,
          pageSize: +pageSize,
          count,
        },
        list: rows,
      });
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("获取企业列表失败");
    }
  }

  /**
   * 导出企业列表
   * @param {*} query
   * @returns
   * @memberof CompanyService
   */
  async exportCompanyListByPch(query) {
    const { street, pch, name, uuid, isconfirm, scale } = query;
    const extra = {};
    isconfirm && (extra.isconfirm = isconfirm);
    scale && (extra.scale = scale);
    try {
      const rows = await this.CompanyPchModel.findAll({
        attributes: [
          // "id", //  update for /home/companyData [CompanyDataForm]
          "name",
          "uuid",
          "street",
          "scale",
          "state",
          "address",
          "legalphone",
        ],
        where: {
          name: {
            $like: `%${name || ""}%`,
          },
          uuid: {
            $like: `%${uuid || ""}%`,
          },
          street: {
            $like: `%${street || ""}%`,
          },
          pch: pch || PCH,
          ...extra,
        },
        include: [
          {
            model: this.app.model.CompanyMjDataModel,
            attributes: [
              "tax",
              "revenue",
              "industrial",
              "energy",
              "rde",
              "staff",
            ],
            where: {
              pch: pch || PCH,
            },
            required: false,
          },
          {
            model: this.app.model.CompanyMjLandModel,
            attributes: ["id", "type", "area", "linktype", "uuid"],
            order: [["type", "DESC"]],
            // required: false,
          },
          {
            model: this.app.model.CompanyMjElecModel,
            attributes: ["id", "elecmeter", "elec"],
            // required: false,
          },
        ],
        order: [["scale", "DESC"]],
      });
      rows.forEach((row) => row && row.toJSON());
      //  租赁信息
      const rent = await this.app.model.CompanyMjLandModel.findAll({
        where: {
          to_object: {
            $in: rows.map((v) => v.dataValues.uuid),
          },
          pch: pch || PCH,
          type: 0,
        },
      });
      rows.forEach(
        (row) =>
          (row.dataValues.company_mj_land_rent = rent.filter(
            (d) => d.uuid == row.dataValues.uuid
          ))
      );
      return this.ServerResponse.createBySuccessData(rows);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("导出企业列表失败");
    }
  }

  /**
   * 获取企业信息(pch)
   * @param {*} params
   * @returns <ServerResponse>
   * @memberof CompanyService
   */
  async getCompanyInfoByPch(params) {
    const { uuid, pch } = params;
    const company = await this.CompanyPchModel.findOne({
      where: {
        uuid,
        pch: pch || PCH,
      },
      include: [
        {
          //  企业指标数据
          model: this.app.model.CompanyMjDataModel,
          attributes: [
            "tax",
            "revenue",
            "industrial",
            "energy",
            "rde",
            "staff",
          ],
          where: {
            pch: pch || PCH,
          },
          required: false,
        },
        {
          //  企业指标数据
          model: this.app.model.CompanyMjDataStateModel,
          attributes: [
            "tax",
            "revenue",
            "industrial",
            "energy",
            "rde",
            "staff",
          ],
          where: {
            pch: pch || PCH,
          },
          required: false,
        },
        {
          //  企业用地指标
          model: this.app.model.CompanyMjLandModel,
          attributes: ["type", "area", "linktype", "to_object"],
          order: [["type", "DESC"]],
          // required: false,
        },
        {
          //  企业用电指标
          model: this.app.model.CompanyMjElecModel,
          attributes: ["elecmeter", "elec"],
          // required: false,
        },
      ],
    });
    if (!company) {
      return this.ServerResponse.createByErrorMsg("企业不存在");
    }
    return this.ServerResponse.createBySuccessData(company.toJSON());
  }

  /**
   * 是否存在用户
   * @param field {String}
   * @param value {String}
   * @return {Promise.<boolean>}
   */
  async _checkExistColByField(field, value) {
    const data = await this.UserModel.findOne({
      where: { [field]: value },
    });
    return data && data.dataValues && data.dataValues.id
      ? data.dataValues.id
      : false;
  }

  /**
   * 批量|更新用地用电数据
   * @param {*} item 条目
   * @param {*} type [1]用电数据[0]用地数据
   * @param {*} to_object 自身uuid
   * @memberof CompanyService
   */
  async addCompanyExtra(item, type, { uuid, pch }) {
    //  shortid验证是否为已存在数据
    await (type
      ? this.CompanyMjElecModel.create({
          elecmeter: item.elecmeter,
          elec: item.elec,
          uuid,
          pch,
        })
      : this.CompanyMjLandModel.create({
          area: item.area,
          uuid: item.uuid,
          type: item.type,
          linktype: item.linktype || 1,
          to_object: uuid,
          pch,
        }));
  }

  /**
   * 删除现有关系
   * @param {*} { uuid, pch }
   * @memberof CompanyService
   */
  async destoryCompanyExtra({ uuid, pch }) {
    await this.CompanyMjElecModel.destroy({
      where: { pch, uuid },
    });
    await this.CompanyMjLandModel.destroy({
      where: { pch, to_object: uuid },
    });
  }

  /**
   * 更新企业信息
   * @param {*} { pch, uuid, basic, elec, land }
   * @returns {ServerResponse}
   * @memberof CompanyService
   */
  async updateCompanyInfoByPch({ pch, uuid, basic, elec, land }) {
    const { address, legalphone, state } = basic;
    await this.CompanyPchModel.update(
      {
        address: address,
        state: state,
        legalphone: legalphone,
      },
      { where: { uuid, pch } }
    );
    await this.destoryCompanyExtra(basic);
    await Promise.all(
      elec.map(async (i) => await this.addCompanyExtra(i, 1, basic))
    );
    await Promise.all(
      land.map(async (i) => await this.addCompanyExtra(i, 0, basic))
    );
    return this.ServerResponse.createBySuccessMsg("修改企业信息成功");
  }

  /**
   * 街道修改密码
   * @param {STRING} username
   * @param {STRING} passwordNew
   */
  async updateCompanyPassport({ username, passwordNew }) {
    const password = md5(passwordNew + this.salt);
    const check = await this._checkExistColByField(USERNAME, username);
    if (check) {
      await this.PassportModel.update(
        {
          p_password: password,
        },
        { where: { user: check }, individualHooks: true }
      );
      return this.ServerResponse.createBySuccessMsg("修改密码成功");
    } else {
      const group = [3]; //  !!写死,企业角色下标为3
      const company = await this.UserModel.create({
        username,
        phone: "",
        department: 0,
        isActive: 1,
        role: "000",
      });
      if (company) {
        await this.PassportModel.create({
          user: company.id,
          protocol: "local",
          password,
          p_password: password,
        });
        await this.UserGroupRelation.bulkCreate(
          group.map((v) => {
            return { group_users: v, user_groups: company.id };
          })
        );
        return this.ServerResponse.createBySuccessMsg(
          "创建用户并修改密码成功",
          company
        );
      } else {
        return this.ServerResponse.createByErrorMsg("创建用户失败");
      }
    }
  }
}

module.exports = CompanyService;
