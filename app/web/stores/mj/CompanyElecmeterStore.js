import { action, observable } from "mobx";
import CompanyAPI from "api/company";

class CompanyElecmeterStore {
  constructor(ctx) {
    this.companyAPI = new CompanyAPI(ctx);
  }

  /**
   * 默认年份
   * @memberof CompanyDataStore
   */
  @observable
  PCH = 2019;

  /**
   * 根据统一社会信用代码查询企业名称
   * @memberof CompanyDataStore
   */
  @action
  fetchCompanyNameByUuid = async (uuids) => {
    const fuuids = uuids.filter((v) =>
      /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(v)
    );
    const res = fuuids.length
      ? await this.companyAPI.fetchCompanyNameByUuid(fuuids)
      : [];
    const uuids2names = {};
    res.map(({ uuid, name }) => (uuids2names[uuid] = name));
    return uuids2names;
  };
}

export default CompanyElecmeterStore;
