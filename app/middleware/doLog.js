/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-05-29 15:04:09
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\middleware\doLog.js
 */

module.exports = options => {
  return async function doLog(ctx, next) {
    await next();
  };
};
