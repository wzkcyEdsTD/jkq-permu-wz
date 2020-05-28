/*
 * @Author: eds
 * @Date: 2020-05-28 16:09:50
 * @LastEditTime: 2020-05-28 19:56:18
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
    const extName = path.extname(stream.filename).toLocaleLowerCase();
    const fileName = `${pch}_${uuid}_${+new Date()}${extName}`;
    const target = path.join(config.baseDir, `files`, fileName);
    const writeStream = fs.createWriteStream(target);
    stream.pipe(writeStream);
    writeStream.on("finish", () => {
      resolve({ fileName });
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
    const { fileName } = await doFilesUpload(this.ctx, this.config);
    const evidenceURL = `/files/${fileName}`;
    const response = await this.CompanyEvidenceService.uploadCompanyEvidence(
      this.ctx.params,
      fileName,
      evidenceURL
    );
    console.log(response);
    this.ctx.body = this.ServerResponse.createBySuccessMsg(evidenceURL);
  }
}

module.exports = CompanyEvidenceController;
