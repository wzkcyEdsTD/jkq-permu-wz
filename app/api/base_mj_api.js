/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-06-01 09:40:42
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\api\base_mj_api.js
 */ 
import BaseAPI from "./base_api";
import HTTPError from "./error/http_error";
import BusinessError from "./error/business_error";

/**
 * 基础请求组件
 * create by eds 2020/4/24
 * @export
 * @class BaseMjAPI
 * @extends {BaseAPI}
 */
export default class BaseMjAPI extends BaseAPI {
  constructor(ctx) {
    let config = {};
    //  [node]    ctx bind api option
    //  [client]  window bind api
    if (BaseAPI.IS_NODE) {
      const {
        baseURL,
        localURL,
        defaultOptions,
      } = ctx.app.config.externalAPI.fwGateway;
      config = { baseURL, localURL, defaultOptions };
    } else {
      config = window.__API_CONFIG__.fwGateway; // eslint-disable-line no-underscore-dangle
    }
    super(config);
    this.ctx = ctx;
  }

  createCookieHeader() {
    const cookieKeys = ["wzkcy_id"];
    const { cookies } = this.ctx;
    let cookieStr = "";
    cookieKeys.forEach(k => {
      const v = cookies.get(k, { signed: false });
      v && (cookieStr += `${k}=${v};`);
    });
    return { Cookie: cookieStr };
  }

  async curl(path, options = {}) {
    const opt = options;
    if (BaseAPI.IS_NODE) {
      const cookieHeader = this.createCookieHeader();
      if (opt.headers) {
        const { Cookie: cookie = "" } = opt.headers;
        opt.headers.Cookie = cookie + cookieHeader.Cookie;
      } else {
        opt.headers = cookieHeader;
      }
    }

    try {
      const result = await super.curl(path, opt);
      const { data: resData } = result;
      if (resData.code > 0) {
        throw new BusinessError(resData);
      }
      return resData.data;
    } catch (err) {
      // 处理HTTP错误
      if (err.response && err.request) {
        throw new HTTPError(err);
      }
      throw err;
    }
  }
}
