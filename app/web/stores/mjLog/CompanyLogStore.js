/*
 * @Author: eds
 * @Date: 2020-05-28 15:41:04
 * @LastEditTime: 2020-06-09 10:02:17
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
};

class CompanyLogStore {
  constructor(ctx) {
    this.companyLogAPI = new CompanyLogAPI(ctx);
  }

  //  用地用电列表
  @observable
  _leList = [];
  @computed.struct
  get leList() {
    return this._leList;
  }

  //  用户登录记录
  @observable
  _loginLogList = [];
  @computed.struct
  get loginLogList() {
    return this._loginLogList;
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

  /**
   * 获取登录日志
   * @memberof CompanyLogStore
   */
  @action
  getLoginLogList = async () => {
    const { list, page } = await this.companyLogAPI.getLoginLogList(
      this._pageQuery
    );
    this._loginLogList = list.map(v => {
      return {
        ...v,
        alias: v.publish_user ? v.publish_user.alias : '',
        groups: v.publish_user ? v.publish_user.groups : [],
      };
    });
    this._pageQuery = { ...this._pageQuery, ...page };
  };
}

export default CompanyLogStore;
