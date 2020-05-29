/*
 * @Author: eds
 * @Date: 2020-05-28 16:09:50
 * @LastEditTime: 2020-05-29 09:39:12
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\mj\CompanyEvidenceController.js
 */

const Controller = require("egg").Controller;
const fs = require("fs");
const path = require("path");

/**
 * 同步文件写入
 * @param {*} ctx
 */
const doFilesUpload = (ctx, config) => {
  return new Promise(async resolve => {
    const { pch, uuid } = ctx.params;
    const stream = await ctx.getFileStream();
    const trueName = stream.filename;
    const extName = path.extname(stream.filename).toLocaleLowerCase();
    const fileName = `${pch}_${uuid}_${+new Date()}${extName}`;
    const target = path.join(config.baseDir, `files`, fileName);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
    writeStream.on("finish", () => {
      resolve({ fileName, trueName });
    });
  });
};
class CompanyEvidenceController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.session = ctx.session;
    this.CompanyEvidenceService = ctx.service.companyEvidenceService;
    this.ResponseCode = ctx.response.ResponseCode;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 上传凭证(pch)
   * @memberof CompanyEvidenceController
   */
  async uploadCompanyEvidence() {
    const { fileName, trueName } = await doFilesUpload(this.ctx, this.config);
    const evidenceURL = `/files/${fileName}`;
    const { username } = this.ctx.session.currentUser;
    const response = await this.CompanyEvidenceService.uploadCompanyEvidence(
      this.ctx.params,
      trueName,
      evidenceURL,
      username
    );
    this.ctx.body = this.ServerResponse.createBySuccessMsg(response);
  }
}

module.exports = CompanyEvidenceController;
