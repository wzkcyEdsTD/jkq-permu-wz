/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:15
 * @LastEditTime: 2020-05-29 14:49:46
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\router\api\groupRouter.js
 */ 
module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    console: { groupController },
  } = controller;
  const prefix = "/api/group";

  router.get(`${prefix}/session`, groupController.getGroupSession);

  router.get(`${prefix}/list`, groupController.index);

  router.get(`${prefix}/option`, groupController.getGroupOption);

  router.put(`${prefix}/update/:id`, groupController.update);

  router.post(`${prefix}`, groupController.create);
};
