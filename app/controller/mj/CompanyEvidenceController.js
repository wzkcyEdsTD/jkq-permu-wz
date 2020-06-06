/*
 * @Author: eds
 * @Date: 2020-05-28 16:09:50
 * @LastEditTime: 2020-06-06 18:34:57
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\mj\CompanyEvidenceController.js
 */

const Controller = require("egg").Controller;
const fs = require("fs");
const path = require("path");
const pdftk = require("node-pdftk");

/**
 * 格式化企业凭证信息
 * @param {*} company
 * @param {*} land
 * @param {*} land_rent
 */
const fixCompanyEvidence = (company, land, land_rent) => {
  const formData = {};
  // Object.keys(company).map(
  //   v =>
  //     typeof company[v] != "object" &&
  //     (formData[`company_${v}`] = `${company[v]}`)
  // );
  land.map((v, index) => {
    Object.keys(v).map(d => (formData[`land_${index + 1}_${d}`] = `${v[d]}`));
  });
  land_rent.map((v, index) => {
    Object.keys(v).map(
      d => (formData[`land_rent_${index + 1}_${d}`] = `${v[d]}`)
    );
  });
  return formData;
};

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
    const target = path.join(config.baseDir, `files/evidence_img`, fileName);
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
    const evidenceURL = `/public/evidence_img/${fileName}`;
    const { username } = this.ctx.session.currentUser;
    const response = await this.CompanyEvidenceService.uploadCompanyEvidence(
      this.ctx.params,
      trueName,
      evidenceURL,
      username
    );
    this.ctx.body = this.ServerResponse.createBySuccessMsg(response);
  }

  /**
   * 生成凭证
   * @memberof CompanyEvidenc
   * eController
   */
  async formFillCompanyEvidence() {
    const { ctx } = this;
    const { company, land, land_rent } = ctx.request.body;
    const { uuid, name, pch } = company;
    const formData = fixCompanyEvidence(company, land, land_rent);
    const { username } = this.ctx.session.currentUser;
    const timestamp = +new Date();
    await pdftk
      .input(path.join(this.config.baseDir, "files/pdf", "test.pdf"))
      .fillForm(formData)
      .flatten()
      .output(
        path.join(
          this.config.baseDir,
          "files/evidence",
          `${name}_${pch}_${timestamp}.pdf`
        )
      );
    const fileURL = `/public/evidence/${name}_${pch}_${timestamp}.pdf`;
    const response = await this.CompanyEvidenceService.exportCompanyEvidence(
      this.ctx.params,
      `${name}_${pch}_${+new Date()}.pdf`,
      fileURL,
      username
    );
    this.ctx.body = this.ServerResponse.createBySuccessData({ fileURL });
  }
}

module.exports = CompanyEvidenceController;
