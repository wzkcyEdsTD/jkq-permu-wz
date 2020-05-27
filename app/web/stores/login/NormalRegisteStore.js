/*
 * @Author: eds
 * @Date: 2020-05-27 15:46:18
 * @LastEditTime: 2020-05-27 16:15:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\web\stores\login\NormalRegisteStore.js
 */

import { action } from "mobx";
import SmsAPI from "api/sms";

class NormalRegisteStore {
  constructor(ctx, initialState) {
    this.smsAPI = new SmsAPI(ctx);
  }

  /**
   * 获取短信验证码
   * @memberof NormalRegisteStore
   */
  @action
  getSmsCode = async phone => {
    await this.smsAPI.getSmsCode(phone);
  };

  /**
   * 通过短信验证码注册
   * @memberof UserStore
   */
  @action
  registeBySmsCode = async params => {
    await this.smsAPI.registeBySmsCode(params);
  };
}

export default NormalRegisteStore;
