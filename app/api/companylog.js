/*
 * @Author: eds
 * @Date: 2020-05-28 15:45:57
 * @LastEditTime: 2020-06-03 15:05:27
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\api\companylog.js
 */

import BaseFwAPI from "./base_mj_api";
export default class CompanyLogAPI extends BaseFwAPI {
  /**
   * 用地用电凭证上传记录
   * @param {*} params
   * @returns
   * @memberof CompanyLogAPI
   */
  getCompanyEvidenceList(params) {
    return this.post("/mjLog/companyle", params);
  }
  /**
   * 用户登录记录
   * @param {*} params
   * @returns
   * @memberof CompanyLogAPI
   */
  getLoginLogList(params) {
    return this.post("/mjLog/loginlog", params);
  }
}
