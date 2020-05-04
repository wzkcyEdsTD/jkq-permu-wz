import { action, observable, computed } from "mobx";
import CompanyAPI from "api/company";

class CompanyUploadStore {
  constructor(ctx, initialState) {
    this.companyAPI = new CompanyAPI(ctx);
  }

  /**
   * 默认年份
   * @memberof CompanyDataStore
   */
  @observable
  PCH = 2019;

  @observable
  _company = {};
  @computed.struct
  get company() {
    return this._company;
  }

  /**
   * 获取企业信息
   * @memberof CompanyUploadStore
   */
  @action
  getCompanyInfoByPch = async ({ username }, pch) => {
    const data = await this.companyAPI.getCompanyInfoByPch({
      username,
      pch: pch || this.PCH,
    });
    this._company = data;
  };
}

export default CompanyUploadStore;
