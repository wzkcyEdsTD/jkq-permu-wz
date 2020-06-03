/*
 * @Author: eds
 * @Date: 2020-05-28 15:45:57
 * @LastEditTime: 2020-06-03 11:03:52
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\api\companylog.js
 */

import BaseFwAPI from "./base_mj_api";
export default class CompanyLogAPI extends BaseFwAPI {
  getCompanyEvidenceList(params) {
    return this.post("/mjLog/companyle", params);
  }
}
