/*
 * @Author: eds
 * @Date: 2020-06-03 11:08:58
 * @LastEditTime: 2020-06-03 11:45:28
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\mjLog\CompanyLogController.js
 */

const Controller = require("egg").Controller;

class CompanyLogController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.CompanyLogService = ctx.service.companyLogService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取企业列表(pch)
   * @memberof CompanyLogController
   */
  async getCompanyEvidenceList() {
    console.log(this.CompanyLogService);
    this.ctx.body = await this.CompanyLogService.getCompanyEvidenceList(
      this.ctx.request.body
    );
  }
}

module.exports = CompanyLogController;
