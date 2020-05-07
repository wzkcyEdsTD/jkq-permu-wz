/* eslint valid-jsdoc: "off" */

const path = require("path");
const fs = require("fs");
("use strict");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});
  config.salt = appInfo.name + "_salt";
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + "_1556632511662_605";

  //  security
  config.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };

  // middleware
  config.middleware = ["parseConfig"];

  // static
  config.static = {
    prefix: "/public/",
    dir: path.join(appInfo.baseDir, "public"),
  };

  //  session
  config.session = {
    key: "wzkcy_id",
    maxAge: 24 * 3600 * 1000, // 1 day
    httpOnly: true,
    encrypt: true,
    // renew: true,
  };

  // external
  config.externalAPI = {
    fwGateway: {
      //  接口入口地址
      baseURL: "http://127.0.0.1:7001/api",
    },
    javaGateway: {
      //  后端java接口地址
      baseURL: "http://192.168.5.147:8084/risk-control-operating-system",
    },
  };

  return {
    ...config,
    // ...userConfig,
  };
};
