/*
 * @Author: eds
 * @Date: 2020-05-27 10:00:34
 * @LastEditTime: 2020-06-05 14:20:47
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\config\config.prod.js
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
    domainWhiteList.push(`http://60.190.114.252:${port}`);
    domainWhiteList.push(`http://192.168.39.41:${port}`);
    domainWhiteList.push(`http://127.0.0.1:${port}`);
    domainWhiteList.push(`http://${localIP}:${port}`);
  });

  exports.security = { domainWhiteList };

  // external
  exports.externalAPI = {
    fwGateway: {
      //  接口入口地址
      hostURL: "http://60.190.114.252:7001",
      baseURL: "/api",
      localURL: "http://127.0.0.1:7001/api",  //localURL 防止服务器访问不到出口IP
    },
    oGateway: {
      //  短信机接口地址
      smsURL: "http://wz023.openmas.net:9080/OpenMasService?wsdl",
    },
  };

  return exports;
};
