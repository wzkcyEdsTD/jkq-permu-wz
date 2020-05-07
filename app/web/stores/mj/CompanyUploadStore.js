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
    const landself =
      eval(
        data.company_mj_lands
          .filter((d) => d.type == 1)
          .map((d) => d.area)
          .join("+")
      ) || 0;
    const landget =
      eval(
        data.company_mj_lands
          .filter((d) => d.type != 1)
          .map((d) => d.area)
          .join("+")
      ) || 0;
    const landr =
      eval(data.company_mj_land_rent.map((d) => d.area).join("+")) || 0;
    !data.company_mj_lands.filter((data) => data.type == 1).length &&
      (data.company_mj_lands = [
        { type: 1, area: 0, uuid, to_object: uuid, id: shortid.generate() },
      ].concat(data.company_mj_lands));
    data.landself = landself;
    data.landget = landget;
    data.landr = landr;
    data.landd = [landself + landget - landr > 0, landself + landget - landr];
    this._company = data;
  };

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

export default CompanyUploadStore;
