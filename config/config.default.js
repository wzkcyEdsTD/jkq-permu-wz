/*
 * @Author: your name
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-06-05 14:16:46
 * @LastEditors: eds
 * @Description: In User Settings Edit
 * @FilePath: \jkq-permu-wz\config\config.default.js
 */

/* eslint valid-jsdoc: "off" */

const path = require("path");
const fs = require("fs");
("use strict");

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});
  config.salt = appInfo.name + "_salt";
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name;

  //  security
  config.security = {
    csrf: {
      enable: false,
    },
    methodnoallow: {
      enable: false,
    },
  };

  config.cors = {
    credentials: true,
  };

  //  前置代理
  config.proxy = true;

  // middleware
  config.middleware = ["parseConfig"];

  // static 凭证保存
  config.static = {
    prefix: "/public/",
    dir: [
      path.join(appInfo.baseDir, "public"),
      path.join(appInfo.baseDir, "files"),
    ],
    maxAge: 31536000, // in prod env, 0 in other envs
    buffer: true, // in prod env, false in other envs
  };

  //  session
  config.session = {
    key: "wzkcy_id",
    maxAge: 12 * 3600 * 1000, // 1 day
    httpOnly: false,
    signed: false,
    encrypt: true,
    // renew: true,
  };

  return {
    ...config,
    // ...userConfig,
  };
};
