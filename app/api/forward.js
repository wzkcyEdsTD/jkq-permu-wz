import BaseFwAPI from './base_mj_api';
export default class ForwardJavaAPI extends BaseFwAPI {
  toJava(params) {
    // 全局带上userId
    if (window.sysUserId && params.params) {
      params.params = {
        ...params.params,
        sysUserId: window.sysUserId || undefined
      };
    }
    //  如果id无效 去除id
    if (!params.id && params.id != 0) {
      delete params.id;
    }
    return this.post('/forward', params);
  }
}
