/*
 * @Author: eds
 * @Date: 2020-05-27 15:55:46
 * @LastEditTime: 2020-05-27 15:58:32
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\api\sms.js
 */

import BaseFwAPI from "./base_mj_api";
export default class SmsAPI extends BaseFwAPI {
  /**
   * 获取短信验证码
   * @param {*} phone
   * @returns
   * @memberof SmsAPI
   */
  getSmsCode(phone) {
    return this.get(`/sms/${phone}`);
  }

  /**
   * 通过短信验证码注册
   * @param {*} params
   * @returns
   * @memberof SmsAPI
   */
  registeBySmsCode(params) {
    return this.post(`/sms/${params.phone}`, params);
  }
}
