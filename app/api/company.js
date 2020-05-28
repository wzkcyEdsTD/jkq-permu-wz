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
  getCompanyInfoByPch(pch) {
    return this.get(`/mj/company/${pch}`);
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
   * 更新企业指标信息
   * @param {*} { uuid, pch, data }
   * @returns
   * @memberof CompanyAPI
   */
  updateCompanyData({ uuid, pch, data }) {
    return this.put(`mj/company/data/${pch}/${uuid}`, data);
  }

  /**
   * 更新企业状态信息
   * @param {*} { uuid, pch, states }
   * @returns
   * @memberof CompanyAPI
   */
  updateCompanyDataState({
    uuid,
    pch,
    states,
    company_mj_elecs,
    company_mj_lands,
  }) {
    return this.put(`mj/company/state/${pch}/${uuid}`, {
      states,
      company_mj_elecs,
      company_mj_lands,
    });
  }

  /**
   * 更新企业基本信息
   * @param {*} { uuid, pch, states }
   * @returns
   * @memberof CompanyAPI
   */
  companyUploadBasicSubmit({ uuid, pch, states }) {
    return this.put(`mj/company/basic/${pch}/${uuid}`, states);
  }

  /**
   * 1.插电表登记记录
   * 2.更新电表数据
   * @param {*} elecmeter     电表号
   * @param {*} elec          用电量
   * @param {*} elecDataObj   公用企业信息
   * @memberof CompanyAPI
   */
  updateCompanyElecmenter(elecmeter, pch, params) {
    return this.put(`mj/company/elecmeter/${pch}/${elecmeter}`, params);
  }

  /**
   * 获取共用电表信息
   * @param {*} uuid
   * @returns
   * @memberof CompanyAPI
   */
  getCompanyElecmenter(pch, uuid) {
    return this.get(`mj/company/elecmeter/${pch}/${uuid}`);
  }
}
