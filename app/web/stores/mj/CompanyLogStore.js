/*
 * @Author: eds
 * @Date: 2020-05-28 15:41:04
 * @LastEditTime: 2020-05-28 15:43:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\stores\mj\CompanyLog.js
 */

import { action, observable, computed } from "mobx";
import CompanyLogAPI from "api/companylog";

class CompanyLogStore {
  constructor(ctx, initialState) {
    this.companyLogAPI = new CompanyLogAPI(ctx);
  }
}

export default CompanyLogStore;
