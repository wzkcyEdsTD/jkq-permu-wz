/*
 * @Author: eds
 * @Date: 2020-05-28 19:09:50
 * @LastEditTime: 2020-06-06 17:36:37
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\service\CompanyEvidenceService.js
 */

const Service = require("egg").Service;

class CompanyEvidenceService extends Service {
  constructor(ctx) {
    super(ctx);
    this.CompanyEvidenceModel = ctx.model.CompanyEvidenceModel;
    this.CompanyEvidenceExportModel = ctx.model.CompanyEvidenceExportModel;
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

  /**
   * 插入生成记录
   * @param {*} { pch, uuid }
   * @param {*} fileName
   * @memberof CompanyService
   */
  async exportCompanyEvidence({ pch, uuid }, filename, fileurl, username) {
    await this.CompanyEvidenceExportModel.create({
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
