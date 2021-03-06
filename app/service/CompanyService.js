const Service = require("egg").Service;
const md5 = require("md5");
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
    this.CompanyElecmeterModel = ctx.model.CompanyElecmeterModel;
    this.CompanyEvidenceModel = ctx.model.CompanyEvidenceModel;
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
    const where = { pch: pch || PCH };
    const extra = {};
    (isconfirm || isconfirm == 0) && (extra.isconfirm = isconfirm);
    (scale || scale == 0) && (extra.scale = scale);
    try {
      const { count, rows } = await this.CompanyPchModel.findAndCountAll({
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
              "sewage",
              "taxtime",
            ],
            where,
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
              "sewage",
              "taxtime",
              "land",
              "elec",
              "civil",
            ],
            where,
            required: false,
          },
          {
            model: this.app.model.CompanyMjLandModel,
            attributes: [
              "id",
              "type",
              "area",
              "linktype",
              "uuid",
              "elecmeter",
              "elec",
            ],
            limit: 20,
            order: [
              ["type", "DESC"],
              ["area", "DESC"],
            ],
            where,
            required: false,
          },
          {
            //  企业凭证
            model: this.app.model.CompanyEvidenceModel,
            where,
            required: false,
            limit: 3,
            order: [["id", "DESC"]],
          },
        ],
        order: [
          ["scale", "DESC"],
          // [this.app.model.CompanyMjLandModel, "type", "DESC"],
          // [this.app.model.CompanyMjLandModel, "area", "DESC"],
          // [this.app.model.CompanyMjElecModel, "elec", "DESC"],
        ],
        limit: Number(pageSize || 10),
        offset: Number(page - 1 || 0) * Number(pageSize || 10),
      });
      rows.forEach(row => row && row.toJSON());
      const rent = await this.app.model.CompanyMjLandModel.findAll({
        where: {
          uuid: {
            $in: [...new Set(rows.map(v => v.dataValues.uuid))],
          },
          pch: pch || PCH,
          type: 0,
        },
        order: [["area", "DESC"]],
      });
      rows.forEach(
        row =>
          (row.dataValues.company_mj_land_rent = rent.filter(
            d => d.uuid == row.dataValues.uuid
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
      console.log(error);
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
    const where = { pch: pch || PCH };
    const extra = {};
    (isconfirm || isconfirm == 0) && (extra.isconfirm = isconfirm);
    (scale || scale == 0) && (extra.scale = scale);
    try {
      const rows = await this.CompanyPchModel.findAll({
        attributes: [
          "id",
          "pch",
          "name",
          "uuid",
          "street",
          "link",
          "linkphone",
          "legal",
          "legalphone",
          "state",
          "scale",
          "address",
          "isconfirm",
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
              "sewage",
              "taxtime",
            ],
            where,
            required: false,
          },
          {
            model: this.app.model.CompanyMjLandModel,
            attributes: [
              "id",
              "type",
              "area",
              "linktype",
              "uuid",
              "elecmeter",
              "elec",
            ],
            order: [["type", "DESC"]],
            where,
            required: false,
          },
        ],
        order: [["scale", "DESC"]],
      });
      rows.forEach(row => row && row.toJSON());
      //  租赁信息
      const rent = await this.app.model.CompanyMjLandModel.findAll({
        where: {
          uuid: {
            $in: [...new Set(rows.map(v => v.dataValues.uuid))],
          },
          pch: pch || PCH,
          type: 0,
        },
        order: [["area", "DESC"]],
      });
      rows.forEach(
        row =>
          (row.dataValues.company_mj_land_rent = rent.filter(
            d => d.uuid == row.dataValues.uuid
          ))
      );
      return this.ServerResponse.createBySuccessData(rows);
    } catch (error) {
      return this.ServerResponse.createByErrorMsg("导出企业列表失败");
    }
  }

  /**
   * 获取企业信息(pch),简单信息
   * @param {*} params
   * @returns
   * @memberof CompanyService
   */
  async getCompanyInfoByPchSimple(params) {
    const { uuid, pch } = params;
    const company = await this.CompanyPchModel.findOne({
      where: {
        uuid,
        pch: pch || PCH,
      },
    });
    return this.ServerResponse.createBySuccessData(company);
  }

  /**
   * 获取企业信息(pch)
   * @param {*} params
   * @returns <ServerResponse>
   * @memberof CompanyService
   */
  async getCompanyInfoByPch(params) {
    const { uuid, pch } = params;
    const where = { pch: pch || PCH };
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
            "sewage",
            "taxtime",
          ],
          where,
          required: false,
        },
        {
          //  企业指标数据状态
          model: this.app.model.CompanyMjDataStateModel,
          attributes: [
            "tax",
            "revenue",
            "industrial",
            "energy",
            "rde",
            "staff",
            "sewage",
            "taxtime",
            "land",
            "elec",
          ],
          where,
          required: false,
        },
        {
          //  企业用地指标
          model: this.app.model.CompanyMjLandModel,
          attributes: [
            "id",
            "type",
            "area",
            "linktype",
            "uuid",
            "to_object",
            "elecmeter",
            "elec",
            "pch",
          ],
          where,
          required: false,
        },
        {
          //  企业凭证
          model: this.app.model.CompanyEvidenceModel,
          where,
          required: false,
          limit: 3,
          order: [["id", "DESC"]],
        },
      ],
      order: [
        [this.app.model.CompanyMjLandModel, "type", "DESC"],
        [this.app.model.CompanyMjLandModel, "area", "DESC"],
      ],
    });
    if (!company) {
      return this.ServerResponse.createByErrorMsg("企业不存在");
    }
    //  租赁信息
    const rent = await this.app.model.CompanyMjLandModel.findAll({
      where: {
        uuid,
        pch: pch || PCH,
        type: 0,
      },
      order: [["area", "DESC"]],
    });
    company.dataValues.company_mj_land_rent = rent;
    return this.ServerResponse.createBySuccessData(company);
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
    console.log(item);
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
          elec: item.elec,
          elecmeter: item.elecmeter,
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
   * @param {*} { pch, uuid, basic, land }
   * @returns {ServerResponse}
   * @memberof CompanyService
   */
  async updateCompanyInfoByPch({ pch, uuid, basic, land }) {
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
      land.map(async i => await this.addCompanyExtra(i, 0, basic))
    );
    return this.ServerResponse.createBySuccessMsg("修改企业信息成功");
  }

  /**
   * 确认民用房信息
   * @param {*} { uuid, pch, civil = true }
   * @returns
   * @memberof CompanyService
   */
  async updateCivilState({ uuid, pch, civil = true }) {
    await this.CompanyMjDataStateModel.update(
      { civil: true },
      { where: { uuid, pch } }
    );
    return this.ServerResponse.createBySuccessMsg("确认民用房信息成功");
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
          group.map(v => {
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

  /**
   * uuids => names
   * @param {*} {uuids = []}
   * @memberof CompanyService
   */
  async fetchCompanyNameByUuid({ uuids = [] }) {
    const names = await this.app.model.CompanyPchModel.findAll({
      attributes: ["name", "uuid"],
      where: {
        uuid: {
          $in: uuids,
        },
      },
    });
    return this.ServerResponse.createBySuccessData(names);
  }

  /**
   * update data
   * @param {*} { basic, data }
   * @returns
   * @memberof CompanyService
   */
  async updateCompanyData({ basic, data }) {
    console.log(basic, data);
    await this.CompanyMjDataModel.update(data, { where: basic });
    return this.ServerResponse.createBySuccessMsg("更新企业指标数据成功");
  }

  /**
   * update data states
   * @param {*} { basic, states }
   * @memberof CompanyService
   */
  async updateCompanyDataState({ basic, states, land }) {
    await this.CompanyMjDataStateModel.destroy({ where: basic });
    await this.CompanyMjDataStateModel.create({ ...basic, ...states });
    await this.CompanyPchModel.update(
      {
        isconfirm: eval(
          Object.keys(states)
            .map(v => states[v])
            .join("&&")
        )
          ? 1
          : 0,
      },
      { where: basic }
    );
    await this.destoryCompanyExtra(basic);
    await Promise.all(
      land.map(async i => await this.addCompanyExtra(i, 0, basic))
    );
    return this.ServerResponse.createBySuccessMsg("修改企业信息成功");
  }

  /**
   * update basic
   * @param {*} { basic, states }
   * @memberof CompanyService
   */
  async companyUploadBasicSubmit({ basic, states }) {
    await this.CompanyPchModel.update(states, { where: basic });
    return this.ServerResponse.createBySuccessMsg("更新基本信息成功");
  }

  /**
   * delete & update elec relation by elecmeter
   * insert elecmeter as log records
   * @param {*} {
   *     pch,
   *     elecmeter,
   *     elec,
   *     operator,
   *     elecDataObj,
   *   }
   * @returns
   * @memberof CompanyService
   */
  async updateCompanyElecmenter({ basic, states }, operator) {
    const { pch, elecmeter } = basic;
    const { elec, elecDataObj } = states;
    //  release relation
    await this.CompanyMjElecModel.destroy({ where: { pch, elecmeter } });
    await this.CompanyElecmeterModel.update(
      {
        enable: false,
      },
      { where: { pch, elecmeter } }
    );
    //  create new
    await this.CompanyMjElecModel.bulkCreate(
      elecDataObj.map(v => {
        return { pch, uuid: v.uuid, elecmeter, elec: v.elec };
      })
    );
    await this.CompanyElecmeterModel.create({
      pch,
      elecmeter,
      elec,
      operator,
      companys: JSON.stringify(elecDataObj),
    });
    return this.ServerResponse.createBySuccessMsg("公用电表信息登记成功");
  }

  /**
   * 共用电表信息
   * @param {*} { pch, uuid }
   * @returns
   * @memberof CompanyService
   */
  async getCompanyElecmenter({ pch, uuid }) {
    const companys = await this.CompanyElecmeterModel.findAll({
      where: {
        companys: {
          $like: `%${uuid}%`,
        },
        pch,
        enable: true,
      },
    });
    return this.ServerResponse.createBySuccessData(companys);
  }
}

module.exports = CompanyService;
