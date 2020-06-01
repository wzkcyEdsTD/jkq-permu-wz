/*
 * @Author: eds
 * @Date: 2020-05-28 19:09:50
 * @LastEditTime: 2020-05-29 17:33:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\service\CompanyEvidenceService.js
 */

const Service = require("egg").Service;

class CompanyEvidenceService extends Service {
  constructor(ctx) {
    super(ctx);
    this.CompanyEvidenceModel = ctx.model.CompanyEvidenceModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 插入上传记录
   * @param {*} { pch, uuid }
   * @param {*} fileName
   * @memberof CompanyService
   */
  async uploadCompanyEvidence({ pch, uuid }, filename, fileurl, username) {
    await this.CompanyEvidenceModel.create({
      uuid,
      pch,
      filename,
      fileurl,
      operator: username,
    });
    return this.ServerResponse.createBySuccessMsg(fileurl);
  }
}

module.exports = CompanyEvidenceService;
