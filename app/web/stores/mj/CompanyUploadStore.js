import { action, observable, computed } from "mobx";
import shortid from "shortid";
import CompanyAPI from "api/company";
import { village } from "enums/Village";

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
  getCompanyInfoByPch = async pch => {
    const data = await this.companyAPI.getCompanyInfoByPch(pch || this.PCH);
    const { uuid } = data;
    let landself = 0,
      elecself = 0,
      landget = 0,
      elecget = 0,
      landr = 0,
      elecr = 0;
    data.company_mj_lands.map(d => {
      landself += d.type == 1 ? d.area : 0;
      elecself += d.type == 1 ? d.elec : 0;
      landget += d.type != 1 ? d.area : 0;
      elecget += d.type != 1 ? d.elec : 0;
    });
    data.company_mj_land_rent.map(d => {
      landr += d.area;
      elecr += e.elec;
    });
    !data.company_mj_lands.filter(data => data.type == 1).length &&
      (data.company_mj_lands = [
        {
          type: 1,
          area: 0,
          uuid,
          to_object: uuid,
          elecmeter: "",
          elec: 0,
          id: shortid.generate(),
        },
      ].concat(data.company_mj_lands));
    data.company_mj_lands = data.company_mj_lands.map(d => {
      return { ...d, uuid: d.uuid == "unknown" ? "" : d.uuid };
    });
    this._company = {
      ...data,
      landself,
      landget,
      landr,
      landd: landself + landget - landr,
      elecself,
      elecget,
      elecr,
      elecd: elecself + elecget - elecr,
      visible: data.link && data.linkphone,
    };
    return data;
  };

  /**
   * 根据统一社会信用代码查询企业名称
   * @memberof CompanyDataStore
   */
  @action
  fetchCompanyNameByUuid = async uuids => {
    const fuuids = uuids.filter(v =>
      /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g.test(v)
    );
    const res = fuuids.length
      ? await this.companyAPI.fetchCompanyNameByUuid(fuuids)
      : [];
    const uuids2names = { ...village };
    res.map(({ uuid, name }) => (uuids2names[uuid] = name));
    return uuids2names;
  };

  /**
   * 更新企业数据状态(pch)
   * @memberof CompanyUploadStore
   */
  @action
  updateCompanyDataState = async obj => {
    await this.companyAPI.updateCompanyDataState(obj);
  };

  /**
   * 更新企业基本信息(pch)
   * @memberof CompanyUploadStore
   */
  @action
  companyUploadBasicSubmit = async obj => {
    await this.companyAPI.companyUploadBasicSubmit(obj);
  };

  /**
   * 生成企业凭证
   * @memberof CompanyUploadStore
   */
  @action
  exportEvidence = async (company, land, land_rent) => {
    return await this.companyAPI.exportEvidence(company, land, land_rent);
  };
}

export default CompanyUploadStore;
