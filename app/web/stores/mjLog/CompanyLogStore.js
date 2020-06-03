/*
 * @Author: eds
 * @Date: 2020-05-28 15:41:04
 * @LastEditTime: 2020-06-03 11:38:05
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\stores\mjLog\CompanyLogStore.js
 */

import { action, observable, computed } from "mobx";
import CompanyLogAPI from "api/companylog";

const initPage = {
  page: 1,
  pageSize: 40,
  count: undefined,
  orderBy: {},
};

class CompanyLogStore {
  constructor(ctx, initialState) {
    this.companyLogAPI = new CompanyLogAPI(ctx);
  }

  @observable
  _leList = [];
  @computed.struct
  get leList() {
    return this._leList;
  }

  @observable
  _pageQuery = initPage;

  @action
  reset() {
    this._pageQuery = initPage;
    this._leList = [];
  }

  /**
   * 获取用地用电列表
   * @memberof CompanyLogStore
   */
  @action
  getCompanyEvidenceList = async () => {
    const { list, page } = await this.companyLogAPI.getCompanyEvidenceList(
      this._pageQuery
    );
    this._leList = [...list];
    this._pageQuery = { ...this._pageQuery, ...page };
  };
}

export default CompanyLogStore;
