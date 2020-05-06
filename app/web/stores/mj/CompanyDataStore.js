import { action, observable, computed } from "mobx";
import CompanyAPI from "api/company";
import { tableToExcel } from "utils/utils";
const initTable = {
  name: "",
  uuid: "",
  pch: 2019,
  isconfirm: 2,
  scale: 2,
};

const initPage = {
  page: 1,
  pageSize: 10,
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
  getCompanyListByPch = async () => {
    const params = {
      ...this._pageQuery,
      ..._fix_query(this._query),
    };
    const { list, page } = await this.companyAPI.getCompanyListByPch(params);
    this._list = list.map((v) => {
      let canConfirm = true;
      const elecd = eval(v.company_mj_elecs.map((d) => d.elec).join("+"));
      const landd = eval(v.company_mj_lands.map((d) => d.area).join("+")) || 0;
      const landr =
        eval(v.company_mj_land_rent.map((d) => d.area).join("+")) || 0;
      const obj = { ...v, ...v.company_mj_datum };
      //  经济指标状态
      Object.keys(v.company_mj_data_state).map((d) => {
        obj[`${d}_state`] = v.company_mj_data_state[d];
        canConfirm = !canConfirm ? canConfirm : v.company_mj_data_state[d];
      });
      //  确认按钮
      obj.disableConfirm = !canConfirm;
      obj.elecd = elecd;
      obj.landd = [landd - landr > 0, landd - landr];
      return obj;
    });
    this._pageQuery = page;
  };

  /**
   * 导出企业列表信息
   * @memberof CompanyDataStore
   */
  @action
  exportCompanyListByPch = async () => {
    const data = await this.companyAPI.exportCompanyListByPch(
      _fix_query(this._query)
    );
    const scaleArr = ["规下", "规上"];
    const stateArr = ["正常", "非本街道", "注销", "迁出", "迁入保护"];
    const list = data.map((v) => {
      const elecd = eval(v.company_mj_elecs.map((d) => d.elec).join("+")) || 0;
      const landd = eval(v.company_mj_lands.map((d) => d.area).join("+")) || 0;
      const landr =
        eval(v.company_mj_land_rent.map((d) => d.area).join("+")) || 0;
      const obj = { ...v.company_mj_datum };
      Object.keys(v).map((n) =>
        typeof v[n] == "object" && v[n] != null ? undefined : (obj[n] = v[n])
      );
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
}

export default CompanyDataStore;
