/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-05-21 19:45:12
 * @LastEditors: Please set LastEditors
 * @Description: sms
 * @FilePath: \jkq-permu-wz\app\router\api\forwardRouter.js
 */ 
module.exports = (app) => {
  const { router, controller } = app;
  const { smsController } = controller;
  const prefix = "/api/sms";

  router.post(`${prefix}`, smsController.index);
};
