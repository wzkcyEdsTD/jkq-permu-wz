/*
 * @Author: eds
 * @Date: 2020-06-03 11:26:37
 * @LastEditTime: 2020-06-03 12:43:03
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\service\CompanyLogService.js
 */

const Service = require("egg").Service;

class CompanyLogService extends Service {
  constructor(ctx) {
    super(ctx);
    this.CompanyEvidenceModel = ctx.model.CompanyEvidenceModel;
    this.ServerResponse = ctx.response.ServerResponse;
  }

  /**
   * 获取用地用电日志列表
   * @param {*} query
   * @memberof CompanyService
   */
  async getCompanyEvidenceList(query) {
    const { pageSize, page } = query;
    const { count, rows } = await this.CompanyEvidenceModel.findAndCountAll({
      order: [["id", "DESC"]],
      limit: Number(pageSize || 10),
      offset: Number(page - 1 || 0) * Number(pageSize || 10),
    });
    rows.forEach(row => row && row.toJSON());
    return this.ServerResponse.createBySuccessData({
      page: {
        page: +page,
        pageSize: +pageSize,
        total: count,
      },
      list: rows,
    });
  }
}

module.exports = CompanyLogService;
