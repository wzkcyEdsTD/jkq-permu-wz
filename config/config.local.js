/*
 * @Author: your name
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-06-05 14:20:26
 * @LastEditors: eds
 * @Description: In User Settings Edit
 * @FilePath: \jkq-permu-wz\config\config.local.js
 */

const ip = require("ip");
const EasyWebpack = require("easywebpack-react");
const Op = require("sequelize").Op;

module.exports = () => {
  const exports = {};

  //  sequelize
  exports.sequelize = {
    dialect: "mssql",
    database: "permu",
    host: "192.168.39.149",
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
  [7001, 9000, 9001, 9002].forEach(port => {
    domainWhiteList.push(`http://localhost:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  // external
  exports.externalAPI = {
    fwGateway: {
      //  接口入口地址
      hostURL: "http://192.168.0.163:7001",
      baseURL: "/api",
      localURL: "http://127.0.0.1:7001/api",
    },
    oGateway: {
      //  短信机接口地址
      smsURL: "http://wz023.openmas.net:9080/OpenMasService?wsdl",
    },
  };

  exports.security = { domainWhiteList };

  return exports;
};
