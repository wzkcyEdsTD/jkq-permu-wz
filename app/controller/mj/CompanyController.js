const Controller = require("egg").Controller;
const _ = require("lodash");

class CompanyController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.CompanyService = ctx.service.companyService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取企业列表(pch)
   * @memberof CompanyController
   */
  async getCompanyListByPch() {
    const { query } = this.ctx;
    const resList = await this.CompanyService.getCompanyListByPch(query);
    this.ctx.body = resList;
  }

  /**
   * 获取企业信息(pch)
   * @memberof CompanyController
   */
  async getCompanyInfoByPch() {
    const res = await this.CompanyService.getCompanyInfoByPch(this.ctx.params);
    this.ctx.body = res;
  }
}

module.exports = CompanyController;
