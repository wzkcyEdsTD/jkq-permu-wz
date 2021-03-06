/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:23
 * @LastEditTime: 2020-06-05 14:18:12
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\api\base_api.js
 */ 
import axios from "axios";
// axios.defaults.withCredentials = true;
import { message } from "antd";
import HTTPError from "./error/http_error";
import BusinessError from "./error/business_error";

export default class BaseAPI {
  constructor(config) {
    const IS_NODE = typeof window === "undefined";
    const { baseURL, localURL, defaultOptions } = config;
    const httpclient = axios.create({
      baseURL: IS_NODE ? localURL : baseURL,
      ...defaultOptions,
    });
    this.httpclient = httpclient;
    this.config = config;
  }

  curl(path, options = {}) {
    const { defaultOptions } = this.config;
    const finalOptions = Object.assign(
      {
        url: path,
      },
      defaultOptions,
      options
    );
    return this.httpclient(finalOptions);
  }

  async getCurl(path, options = {}) {
    try {
      const responseData = await this.curl(path, options);
      return responseData;
    } catch (err) {
      if (err instanceof BusinessError) {
        message.error(err.data.msg || "系统繁忙，请稍后重试", 2);
      }
      if (err instanceof HTTPError) {
        if (err.status === 401) {
          if (typeof window !== "undefined") {
            const { pathname, search } = window.location;
            window.location.href = `/login?from=${encodeURIComponent(
              pathname + search
            )}`;
          }
        } else {
          if (typeof window !== "undefined") {
            message.error(err.message || "系统繁忙，请稍后重试", 2);
          }
        }
      }
      throw err;
    } finally {
    }
  }

  post(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: "POST",
      data,
    });
  }

  get(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: "GET",
      params: data,
    });
  }

  put(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: "PUT",
      data,
    });
  }

  delete(path, data, options = {}) {
    return this.getCurl(path, {
      ...options,
      method: "DELETE",
      data,
    });
  }
}

BaseAPI.IS_NODE = typeof window === "undefined";
