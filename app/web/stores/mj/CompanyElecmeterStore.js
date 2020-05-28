/*
 * @Author: eds
 * @Date: 2020-05-09 11:28:45
 * @LastEditTime: 2020-05-28 15:01:55
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\web\stores\mj\CompanyElecmeterStore.js
 */ 
import { action, observable } from "mobx";
import CompanyAPI from "api/company";
import village from "enums/Village";

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
   * 电表更新
   * @memberof CompanyElecmeterStore
   */
  @action
  updateCompanyElecmenter = async (elecmeter, elec, elecDataObj) => {
    await this.companyAPI.updateCompanyElecmenter(elecmeter, this.PCH, {
      elec,
      elecDataObj,
    });
  };
}

export default CompanyElecmeterStore;
