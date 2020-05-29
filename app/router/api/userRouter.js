/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-05-29 14:49:16
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\router\api\userRouter.js
 */ 
module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    console: { userController },
  } = controller;
  const prefix = "/api/user";

  router.post(`${prefix}/login`, userController.login);
  router.post(`${prefix}/register`, userController.register);
  router.post(`${prefix}`, userController.create);

  router.get(`${prefix}/list`, userController.index);
  router.get(`${prefix}/logout`, userController.logout);
  router.get(`${prefix}/session`, userController.getUserSession);
  router.get(`${prefix}/:userId`, userController.show);

  router.put(`${prefix}/:userId`, userController.update);

  router.put(`${prefix}/resetPassword/:userId`, userController.resetPassword);
  router.put(
    `${prefix}/adminResetPassword/:userId`,
    userController.adminResetPassword
  );
  router.put(`${prefix}/updateToAdmin/:userId`, userController.updateToAdmin);

  router.delete(`${prefix}/delete/:userId`, userController.delete);

  router.get(`${prefix}/job/option`, userController.getJobOption);
  router.get(`${prefix}/department/option`, userController.getDepartmentOption);
};
