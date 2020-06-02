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

class CompanyProgressStore {
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
      const elecd = eval(v.company_mj_elecs.map(d => d.elec).join("+"));
      const landself =
        eval(
          v.company_mj_lands
            .filter(d => d.type == 1)
            .map(d => d.area)
            .join("+")
        ) || 0;
      const landget =
        eval(
          v.company_mj_lands
            .filter(d => d.type != 1)
            .map(d => d.area)
            .join("+")
        ) || 0;
      const landr =
        eval(v.company_mj_land_rent.map(d => d.area).join("+")) || 0;
      const obj = { ...v, ...v.company_mj_datum };
      !obj.company_mj_lands.filter(v => v.type == 1).length &&
        (obj.company_mj_lands = [
          { type: 1, area: 0, uuid, to_object: uuid, id: shortid.generate() },
        ].concat(obj.company_mj_lands));
      //  经济指标状态
      Object.keys(v.company_mj_data_state).map(d => {
        obj[`${d}_state`] = v.company_mj_data_state[d];
      });
      obj.company_mj_lands = obj.company_mj_lands.map(d => {
        return { ...d, uuid: d.uuid == "unknown" ? "" : d.uuid };
      });
      obj.disableConfirm = !obj.isconfirm;  //  确认按钮
      obj.elecd = elecd;
      obj.landself = landself;
      obj.landget = landget;
      obj.landr = landr;
      obj.landd = [landself + landget - landr > 0, landself + landget - landr];
      return obj;
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
    const stateArr = ["正常", "非本街道", "注销", "迁出", "迁入保护"];
    const list = data.map((v, index) => {
      const elecd = eval(v.company_mj_elecs.map(d => d.elec).join("+")) || 0;
      const landd = eval(v.company_mj_lands.map(d => d.area).join("+")) || 0;
      const landr =
        eval(v.company_mj_land_rent.map(d => d.area).join("+")) || 0;
      const obj = { ...v.company_mj_datum };
      Object.keys(v).map(n =>
        typeof v[n] == "object" && v[n] != null ? undefined : (obj[n] = v[n])
      );
      obj.company_mj_lands = obj.company_mj_lands.map(d => {
        return { ...d, uuid: d.uuid == "unknown" ? "" : d.uuid };
      });
      obj.id = index + 1;
      obj.elecd = elecd;
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
  updateCompanyInfoByPch = async (basic, elec, land) => {
    await this.companyAPI.updateCompanyInfoByPch({
      basic: { ...basic, pch: this.PCH },
      elec,
      land,
    });
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
   * 共用电表查询
   * @memberof CompanyProgressStore
   */
  @action
  getCompanyElecmenter = async uuid => {
    const elecList = await this.companyAPI.getCompanyElecmenter(this.PCH, uuid);
    return elecList.map(v => {
      return { ...v, companys: JSON.parse(v.companys) };
    });
  };

  /**
   * 更新企业指标
   * @param {*} obj { uuid, pch, data }
   * @memberof CompanyProgressStore
   */
  @action
  updateCompanyData = async obj => {
    const { uuid, pch } = obj;
    const data = {};
    for (let v in obj) {
      !~["pch", "uuid", "name"].indexOf(v) && (data[v] = parseFloat(obj[v]));
    }
    await this.companyAPI.updateCompanyData({ uuid, pch, data });
  };
}

export default CompanyProgressStore;
