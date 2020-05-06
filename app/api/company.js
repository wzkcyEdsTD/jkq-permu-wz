import BaseFwAPI from "./base_mj_api";
export default class CompanyAPI extends BaseFwAPI {
  getCompanyListByPch(params) {
    return this.get("/mj/company", params);
  }
  /**
   * [根据筛选条件]导出
   * @param {*} params
   * @returns
   * @memberof CompanyAPI
   */
  exportCompanyListByPch(params) {
    return this.get("/mj/company/export", params);
  }
  /**
   * 企业获取信息
   * @param {*} { username, pch } username = uuid
   * @returns
   * @memberof CompanyAPI
   */
  getCompanyInfoByPch({ username, pch }) {
    return this.get(`/mj/company/${username}/${pch}`);
  }
  /**
   * 更新企业信息
   * @param {*} {basic,elec,land}
   * @returns
   * @memberof CompanyAPI
   */
  updateCompanyInfoByPch({ basic, elec, land }) {
    return this.put(`/mj/company/${basic.pch}/${basic.uuid}`, {
      basic,
      elec,
      land,
    });
  }
}
