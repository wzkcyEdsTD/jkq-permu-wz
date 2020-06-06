/*
 * @Author: eds
 * @Date: 2020-04-27 18:37:41
 * @LastEditTime: 2020-06-06 16:48:17
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\tools\alias.js
 */ 
const path = require("path");

const root = [path.resolve(__dirname, "..")];
const env = process.env.NODE_ENV;

module.exports.babel = {
  root,
  alias: {
    api: "./app/api",
    enums: "./app/enum",
    framework: "./app/web/framework",
    components: "./app/web/components",
    constants: "./app/web/constants",
    images: "./app/web/images",
    stores: "./app/web/stores",
    styles: "./app/web/styles",
    utils: "./app/web/utils",
  },
};

module.exports.webpack = {
  root,
  alias: {
    api: "app/api",
    enums: "app/enum",
    framework: "app/web/framework",
    components: "app/web/components",
    constants: "app/web/constants",
    images: "app/web/images",
    stores: "app/web/stores",
    styles: "app/web/styles",
    utils: "app/web/utils",
  },
};
