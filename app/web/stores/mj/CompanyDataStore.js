import { action, observable, computed } from "mobx";
import CompanyAPI from "api/company";
import shortid from "shortid";
import { tableToExcel } from "utils/utils";
import { village } from "enums/Village";
const initTable = {
  name: "",
  uuid: "",
  pch: 2019,
  isconfirm: 2,
  scale: 2,
};

const initPage = {
  page: 1,
  pageSize: 40,
  count: undefined,
  orderBy: {},
};

/**
 * 检索元素
 * @param {*} param0
 */
const _fix_query = ({ name, uuid, pch, isconfirm, scale }) => {
  const obj = { name, uuid, pch };
  if (isconfirm != 2) obj.isconfirm = isconfirm;
  if (scale != 2) obj.scale = scale;
  return obj;
};

class CompanyDataStore {
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
  street = "";

  @observable
  _list = [];
  @computed.struct
  get list() {
    return this._list;
  }

  @observable
  _pageQuery = initPage;

  @observable
  _query = initTable;

  @action
  reset() {
    this._pageQuery = initPage;
    this._query = initTable;
    this._list = [];
  }

  /**
   * 获取企业列表
   * @memberof CompanyDataStore
   */
  @action
  getCompanyListByPch = async (name, { username }) => {
    const params = {
      ...this._pageQuery,
      ..._fix_query(this._query),
      street: name == "街道" ? username : "",
    };
    const { list, page } = await this.companyAPI.getCompanyListByPch(params);
    this._list = list.map(v => {
      const { uuid } = v;
      let landself = 0,
        elecself = 0,
        landget = 0,
        elecget = 0,
        landr = 0,
        elecr = 0;
      v.company_mj_lands.map(d => {
        landself += d.type == 1 ? d.area : 0;
        elecself += d.type == 1 ? d.elec : 0;
        landget += d.type != 1 ? d.area : 0;
        elecget += d.type != 1 ? d.elec : 0;
      });
      v.company_mj_land_rent.map(d => {
        landr += d.area;
        elecr += e.elec;
      });
      const obj = { ...v, ...v.company_mj_datum };
      !obj.company_mj_lands.filter(v => v.type == 1).length &&
        (obj.company_mj_lands = [
          {
            type: 1,
            area: 0,
            uuid,
            to_object: uuid,
            elecmeter: "",
            elec: 0,
            linktype: 1,
            id: shortid.generate(),
          },
        ].concat(obj.company_mj_lands));
      //  经济指标状态
      Object.keys(v.company_mj_data_state).map(d => {
        obj[`${d}_state`] = v.company_mj_data_state[d];
      });
      obj.company_mj_lands = obj.company_mj_lands.map(d => {
        if (d.uuid == "330371000000") obj.iscivil = true;
        return { ...d, uuid: d.uuid == "unknown" ? "" : d.uuid };
      });
      return {
        ...obj,
        landself,
        landget,
        landr,
        landd: landself + landget - landr,
        elecself,
        elecget,
        elecr,
        elecd: elecself + elecget - elecr,
        disableConfirm: !obj.isconfirm,
      };
    });
    this._pageQuery = { ...this._pageQuery, ...page };
  };

  /**
   * 导出企业列表信息
   * @memberof CompanyDataStore
   */
  @action
  exportCompanyListByPch = async (name, { username }) => {
    const data = await this.companyAPI.exportCompanyListByPch({
      ..._fix_query(this._query),
      street: name == "街道" ? username : "",
    });
    const scaleArr = ["规下", "规上"];
    const stateArr = [
      "正常",
      "非本街道",
      "注销",
      "迁出",
      "迁入保护",
      "纳税小于3万",
      "税收及收入无法匹配",
    ];
    const list = data.map((v, index) => {
      let landd = 0,
        elecd = 0,
        landr = 0,
        elecr = 0;
      v.company_mj_lands.map(v => {
        landd += v.area;
        elecd += v.elec;
      });
      v.company_mj_land_rent.map(v => {
        landr += v.area;
        elecr += v.elec;
      });
      const obj = { ...v.company_mj_datum };
      Object.keys(v).map(n =>
        typeof v[n] == "object" && v[n] != null ? undefined : (obj[n] = v[n])
      );
      obj.company_mj_lands = v.company_mj_lands.map(d => {
        return { ...d, uuid: d.uuid == "unknown" ? "" : d.uuid };
      });
      obj.id = index + 1;
      obj.elecd = elecd - elecr;
      obj.landd = landd - landr;
      obj.scale = scaleArr[obj.scale];
      obj.state = stateArr[obj.state];
      return obj;
    });
    data && data.length && tableToExcel(list);
    return data;
  };

  /**
   * 更新企业信息
   * @memberof CompanyDataStore
   */
  @action
  updateCompanyInfoByPch = async (basic, land) => {
    await this.companyAPI.updateCompanyInfoByPch({
      basic: { ...basic, pch: this.PCH },
      land,
    });
  };

  /**
   * 确认民用房信息
   * @memberof CompanyDataStore
   */
  @action
  updateCivilState = async uuid => {
    await this.companyAPI.updateCivilState(uuid, this.PCH);
  };

  /**
   * 更新企业登录密码
   * @memberof CompanyDataStore
   */
  @action
  updateCompanyPassport = async values => {
    await this.companyAPI.updateCompanyPassport(values);
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
   * 生成企业凭证
   * @memberof CompanyUploadStore
   */
  @action
  exportEvidence = async (company, land, land_rent) => {
    return await this.companyAPI.exportEvidence(company, land, land_rent);
  };
}

export default CompanyDataStore;
