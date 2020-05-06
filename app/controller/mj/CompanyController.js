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
    this.ctx.body = await this.CompanyService.getCompanyListByPch(
      this.ctx.query
    );
  }

  /**
   * 导出企业列表(params)
   * @memberof CompanyController
   */
  async exportCompanyListByPch() {
    const res = await this.CompanyService.exportCompanyListByPch(
      this.ctx.query
    );
    //  前端导出
    this.ctx.body = res;
    //  后端导出
    // this.ctx.helper.exportXLSX("file", "t", res);
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
