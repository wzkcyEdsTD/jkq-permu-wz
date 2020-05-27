/*
 * @Author: your name
 * @Date: 2020-05-27 10:00:34
 * @LastEditTime: 2020-05-27 10:17:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \jkq-permu-wz\config\config.prod.js
 */ 
const ip = require("ip");
const EasyWebpack = require("easywebpack-react");
const Op = require("sequelize").Op;

module.exports = () => {
  const exports = {};

  exports.static = {
    maxAge: 0, // maxAge 缓存，默认 1 年
  };

  //  sequelize
  exports.sequelize = {
    dialect: "mssql",
    database: "permu",
    host: "127.0.0.1",
    port: "1433",
    username: "sa",
    password: "wzkcy@123",
    operatorsAliases: {
      $like: Op.like,
      $in: Op.in,
    },
  };

  exports.development = {
    watchDirs: ["build"], // 指定监视的目录（包括子目录），当目录下的文件变化的时候自动重载应用，路径从项目根目录开始写
    ignoreDirs: ["app/web", "public", "config"], // 指定过滤的目录（包括子目录）
  };

  exports.reactssr = {
    injectCss: true,
  };

  exports.webpack = {
    webpackConfigList: EasyWebpack.getWebpackConfig(),
  };

  const localIP = ip.address();
  const domainWhiteList = [];
  [7001, 9000, 9001, 9002].forEach((port) => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  exports.security = { domainWhiteList };

  // external
  exports.externalAPI = {
    fwGateway: {
      //  接口入口地址
      baseURL: "http://192.168.0.139:7001/api",
    },
    oGateway: {
      //  短信机接口地址
      smsURL: "http://wz023.openmas.net:9080/OpenMasService?wsdl",
    },
  };

  return exports;
};
