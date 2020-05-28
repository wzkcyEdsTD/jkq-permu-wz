/*
 * @Author: eds
 * @Date: 2020-05-28 19:09:50
 * @LastEditTime: 2020-05-28 19:18:27
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\service\CompanyEvidenceService.js
 */

const Service = require("egg").Service;

class CompanyEvidenceService extends Service {
  constructor(ctx) {
    super(ctx);
    // this.SmsCodeModel = ctx.model.SmsCodeModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 插入上传记录
   * @param {*} { type, pch, uuid, extra }
   * @param {*} fileName
   * @memberof CompanyService
   */
  async uploadCompanyEvidence(
    { type, pch, uuid, extra },
    fileName,
    evidenceURL
  ) {
    return this.ServerResponse.createBySuccessMsg("新增凭证信息成功");
  }
}

module.exports = CompanyEvidenceService;
