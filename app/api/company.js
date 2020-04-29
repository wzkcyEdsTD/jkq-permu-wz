import BaseFwAPI from "./base_mj_api";
export default class CompanyAPI extends BaseFwAPI {
  getCompanyListByPch(params) {
    return this.get(`/mj/company`, params);
  }
}
