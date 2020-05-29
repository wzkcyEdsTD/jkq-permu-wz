/*
 * @Author: eds
 * @Date: 2020-04-27 08:50:23
 * @LastEditTime: 2020-05-29 14:49:30
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\router\api\menuRouter.js
 */ 
module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    console: { menuController },
  } = controller;
  const prefix = "/api/menu";

  router.post(`${prefix}/session`, menuController.getMenuSession);

  router.get(`${prefix}/list`, menuController.index);

  router.get(`${prefix}/all`, menuController.fetchMenuAll);

  router.get(`${prefix}/option`, menuController.getMenuOption);

  router.put(`${prefix}/update/:id`, menuController.update);

  router.post(`${prefix}`, menuController.create);

  router.put(`${prefix}/store/:id`, menuController.saveMenuStore);
};
