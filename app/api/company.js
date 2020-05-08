import BaseFwAPI from "./base_mj_api";
export default class CompanyAPI extends BaseFwAPI {
  getCompanyListByPch(params) {
    return this.post("/mj/company", params);
  }
  /**
   * [根据筛选条件]导出
   * @param {*} params
   * @returns
   * @memberof CompanyAPI
   */
  exportCompanyListByPch(params) {
    return this.post("/mj/company/export", params);
  }
  /**
   * 企业获取信息
   * @param {*} { username, pch } username = uuid
   * @returns
   * @memberof CompanyAPI
   */
  getCompanyInfoByPch({ username, pch }) {
    return this.post(`/mj/company/${pch}/${username}`);
  }
  /**
   * 更新企业信息
   * @param {*} { basic, elec, land }
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
  /**
   * 更新企业登陆密码
   * @param {*} { username, passwordNew }
   * @returns
   * @memberof CompanyAPI
   */
  updateCompanyPassport({ username, passwordNew }) {
    return this.put(`/mj/company/${username}`, { passwordNew });
  }

  /**
   * 获取企业名称
   * @param {*} uuids
   * @returns
   * @memberof CompanyAPI
   */
  fetchCompanyNameByUuid(uuids) {
    return this.post("mj/company/names", { uuids });
  }

  /**
   * 更新企业状态信息
   * @param {*} { uuid, pch, states }
   * @returns
   * @memberof CompanyAPI
   */
  updateCompanyDataState({ uuid, pch, states }) {
    return this.put(`mj/company/state/${pch}/${uuid}`, states);
  }
}
