const Controller = require("egg").Controller;

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
      this.ctx.request.body
    );
  }

  /**
   * 导出企业列表(params)
   * @memberof CompanyController
   */
  async exportCompanyListByPch() {
    const res = await this.CompanyService.exportCompanyListByPch(
      this.ctx.request.body
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

  /**
   * 更新企业信息
   * @memberof CompanyController
   */
  async updateCompanyInfoByPch() {
    const response = await this.CompanyService.updateCompanyInfoByPch({
      ...this.ctx.params,
      ...this.ctx.request.body,
    });
    this.ctx.body = response;
  }

  /**
   * 更新企业密码
   * @memberof CompanyController
   */
  async updateCompanyPassport() {
    const response = await this.CompanyService.updateCompanyPassport({
      ...this.ctx.params,
      ...this.ctx.request.body,
    });
    this.ctx.body = response;
  }

  /**
   * 根据统一社会信用代码查询企业名称
   * @memberof CompanyController
   */
  async fetchCompanyNameByUuid() {
    const response = await this.CompanyService.fetchCompanyNameByUuid(
      this.ctx.request.body
    );
    this.ctx.body = response;
  }

  /**
   * 更新企业指标数据状态(pch)
   * @memberof CompanyController
   */
  async updateCompanyDataState() {
    const response = await this.CompanyService.updateCompanyDataState({
      basic: this.ctx.params,
      states: this.ctx.request.body,
    });
    this.ctx.body = response;
  }

  /**
   * 更新企业基本数据(pch)
   * @memberof CompanyController
   */
  async companyUploadBasicSubmit() {
    const response = await this.CompanyService.companyUploadBasicSubmit({
      basic: this.ctx.params,
      states: this.ctx.request.body,
    });
    this.ctx.body = response;
  }

  /**
   * 插用电计量,更新用电表(elecmeter)
   * @memberof CompanyController
   */
  async updateCompanyElecmenter() {
    const response = await this.CompanyService.updateCompanyElecmenter({
      basic: this.ctx.params,
      states: this.ctx.request.body,
    });
    this.ctx.body = response;
  }
}

module.exports = CompanyController;
