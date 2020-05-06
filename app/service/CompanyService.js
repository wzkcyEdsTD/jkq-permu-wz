const Service = require("egg").Service;
const _ = require("lodash");
const PCH = "2019";
class CompanyService extends Service {
  constructor(ctx) {
    super(ctx);
    this.CompanyPchModel = ctx.model.CompanyPchModel;
    this.CompanyMjDataModel = ctx.model.CompanyMjDataModel;
    this.CompanyMjDataStateModel = ctx.model.CompanyMjDataStateModel;
    this.CompanyMjElecModel = ctx.model.CompanyMjElecModel;
    this.CompanyMjLandModel = ctx.model.CompanyMjLandModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取企业列表(pch)
   * @param {*} params
   * @returns <ServerResponse>
   * @memberof CompanyService
   */
  async getCompanyListByPch(query) {
    const { page, pageSize, pch, name, uuid, isconfirm, scale } = query;
    const extra = {};
    isconfirm && (extra.isconfirm = isconfirm);
    scale && (extra.scale = scale);
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
    const { pch, name, uuid, isconfirm, scale } = query;
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
}

module.exports = CompanyService;
