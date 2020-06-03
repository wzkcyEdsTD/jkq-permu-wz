/*
 * @Author: eds
 * @Date: 2020-06-03 11:08:58
 * @LastEditTime: 2020-06-03 14:45:02
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
   * 用地用电凭证日志列表
   * @memberof CompanyLogController
   */
  async getCompanyEvidenceList() {
    this.ctx.body = await this.CompanyLogService.getCompanyEvidenceList(
      this.ctx.request.body
    );
  }

  /**
   * 登录日志列表
   * @memberof CompanyLogController
   */
  async getLoginLogList() {
    this.ctx.body = await this.CompanyLogService.getLoginLogList(
      this.ctx.request.body
    );
  }
}

module.exports = CompanyLogController;
