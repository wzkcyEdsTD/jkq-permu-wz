/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-06-02 19:22:21
 * @LastEditors: eds
 * @Description: In User Settings Edit
 * @FilePath: \jkq-permu-wz\app.js
 */ 
/*
 *                        _oo0oo_
 *                       o8888888o
 *                       88" . "88
 *                       (| -_- |)
 *                       0\  =  /0
 *                     ___/`---'\___
 *                   .' \\|     |// '.
 *                  / \\|||  :  |||// \
 *                 / _||||| -:- |||||- \
 *                |   | \\\  - /// |   |
 *                | \_|  ''\---/''  |_/ |
 *                \  .-\__  '-'  ___/-. /
 *              ___'. .'  /--.--\  `. .'___
 *           ."" '<  `.___\_<|>_/___.' >' "".
 *          | | :  `- \`.;`\ _ /`;.`/ - ` : | |
 *          \  \ `_.   \_ __\ /__ _/   .-` /  /
 *      =====`-.____`.___ \_____/___.-`___.-'=====
 *                        `=---='
 * 
 * 
 *      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * 
 *            佛祖保佑       永不宕机     永无BUG
 */
const init = async (app) => {
  app.beforeStart(async () => {
    // await app.model.sync({ force: true });
    await app.model.sync();
    console.log("[egg.model] db on");
  });
};
module.exports = init;
