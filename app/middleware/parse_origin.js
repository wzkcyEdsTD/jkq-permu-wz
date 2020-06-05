/*
 * @Author: eds
 * @Date: 2020-06-05 12:28:06
 * @LastEditTime: 2020-06-05 12:37:44
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\middleware\parse_origin.js
 */
module.exports = (option, app) => {
  return async function setOrigin(ctx, next) {
    const { security } = app.config;
    const { origin } = ctx.request.header;
    if (
      ~security.domainWhiteList.indexOf("*") ||
      ~security.domainWhiteList.indexOf(origin)
    ) {
      ctx.response.set("Access-Control-Allow-Origin", origin);
    }
    await next();
  };
};
