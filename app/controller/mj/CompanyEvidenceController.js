/*
 * @Author: eds
 * @Date: 2020-05-28 16:09:50
 * @LastEditTime: 2020-06-09 11:02:29
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\controller\mj\CompanyEvidenceController.js
 */

const Controller = require("egg").Controller;
const fs = require("fs");
const path = require("path");
const fill_pdf = require("fill-pdf-utf8");

/**
 * 格式化企业凭证信息
 * @param {*} company
 * @param {*} land
 * @param {*} land_rent
 */
const fixCompanyEvidence = (company, land, land_rent) => {
  const formData = {};
  Object.keys(company).map(
    v =>
      typeof company[v] != "object" &&
      (formData[`company_${v}`] = `${company[v] || `/`}`)
  );
  land
    .filter(v => v.type)
    .map(v => {
      formData["company_elecmeter"] = v.elecmeter || "/";
    });
  const company_get_elecmeter = [];
  land
    .filter(v => !v.type)
    .map((v, index) => {
      Object.keys(v).map(
        d => (formData[`land_${index + 1}_${d}`] = `${v[d] || `/`}`)
      );
      company_get_elecmeter.push(v["elecmeter"]);
    });
  formData["company_get_elecmeter"] = company_get_elecmeter.join("\n");
  land_rent.map((v, index) => {
    Object.keys(v).map(
      d => (formData[`land_rent_${index + 1}_${d}`] = `${v[d] || `/`}`)
    );
  });
  return formData;
};

/**
 * 中文编码填充pdf
 * @param {*} pdfLen
 * @param {*} formData
 * @param {*} param2
 * @param {*} config
 */
const fillPDFWithUTF8 = (pdfLen, formData, { name, pch }, config) => {
  const indexArr = ["", "", "2", "3"];
  console.log(pdfLen, indexArr[pdfLen]);
  return new Promise(async resolve => {
    const timestamp = +new Date();
    fill_pdf.generatePdf(
      { fields: formData },
      path.join(config.baseDir, "files/pdf", `evidence${indexArr[pdfLen]}.pdf`),
      "need_appearances",
      path.join(
        config.baseDir,
        "files/evidence",
        `${name}_${pch}_${timestamp}.pdf`
      ),
      () => {
        resolve({
          fileName: `${name}_${pch}_${timestamp}.pdf`,
          fileURL: `/public/evidence/${name}_${pch}_${timestamp}.pdf`,
        });
      }
    );
  });
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
    const formData = fixCompanyEvidence(company, land, land_rent);
    const { username } = this.ctx.session.currentUser;
    const { fileName, fileURL } = await fillPDFWithUTF8(
      //  取租地、出租地长度最大值/3 页数
      Math.ceil(
        Math.max(land.length ? land.length - 1 : 0, land_rent.length) / 3
      ) || 1,
      formData,
      company,
      this.config
    );
    await this.CompanyEvidenceService.exportCompanyEvidence(
      this.ctx.params,
      fileName,
      fileURL,
      username
    );
    this.ctx.body = this.ServerResponse.createBySuccessData({ fileURL });
  }
}

module.exports = CompanyEvidenceController;
