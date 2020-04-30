import { action, observable, computed } from "mobx";
import CompanyAPI from "api/company";

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
 * query
 * @param {*} query
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
      const obj = { ...v, ...v.company_mj_datum };
      //  经济指标状态
      Object.keys(v.company_mj_data_state).map((d) => {
        obj[`${d}_state`] = v.company_mj_data_state[d];
        canConfirm = !canConfirm ? canConfirm : v.company_mj_data_state[d];
      });
      //  确认按钮
      obj.disableConfirm = !canConfirm;
      return obj;
    });
    this._pageQuery = page;
  };
}

export default CompanyDataStore;
