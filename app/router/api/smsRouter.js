/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-05-27 11:20:59
 * @LastEditors: eds
 * @Description: sms
 * @FilePath: \jkq-permu-wz\app\router\api\smsRouter.js
 */ 
module.exports = (app) => {
  const { router, controller } = app;
  const { smsController } = controller;
  const prefix = "/api/sms";

  router.get(`${prefix}/:phone`, smsController.index);
  router.post(`${prefix}/:phone`, smsController.verify);
};
