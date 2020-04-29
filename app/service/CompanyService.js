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
        attributes: ["name", "uuid", "street", "scale", "state"],
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
          },
        ],
        order: [["scale", "DESC"]],
        limit: Number(pageSize || 10),
        offset: Number(page - 1 || 0) * Number(pageSize || 10),
      });
      if (rows.length < 1) {
        this.ServerResponse.createBySuccessMsg("无数据");
      }
      rows.forEach((row) => row && row.toJSON());
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
      return this.ServerResponse.createByErrorMsg("获取用户组列表失败");
    }
  }

  /**
   * 获取企业信息(pch)
   * @param {*} params
   * @returns <ServerResponse>
   * @memberof CompanyService
   */
  async getCompanyInfoByPch(params) {
    const { uuid } = params;
    const company = await this.CompanyPchModel.findOne({
      where: { uuid },
    });
    if (!company) {
      return this.ServerResponse.createByErrorMsg("用户不存在");
    }
    return this.ServerResponse.createBySuccessData(company.toJSON());
  }
}

module.exports = CompanyService;
