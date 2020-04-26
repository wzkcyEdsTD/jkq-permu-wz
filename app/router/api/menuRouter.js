module.exports = (app) => {
  const { router, controller, middleware } = app;
  const {
    console: { menuController },
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = "/api/menu";

  router.post(`${prefix}/session`, menuController.getMenuSession);

  router.get(`${prefix}/list`, checkPrivileges, menuController.index);

  router.get(`${prefix}/all`, checkPrivileges, menuController.fetchMenuAll);

  router.get(`${prefix}/option`, checkPrivileges, menuController.getMenuOption);

  router.put(`${prefix}/update/:id`, checkPrivileges, menuController.update);

  router.post(`${prefix}`, checkPrivileges, menuController.create);

  router.put(
    `${prefix}/store/:id`,
    checkPrivileges,
    menuController.saveMenuStore
  );
};
