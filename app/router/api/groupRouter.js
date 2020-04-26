module.exports = (app) => {
  const { router, controller, middleware } = app;
  const {
    console: { groupController },
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = "/api/group";

  router.get(`${prefix}/session`, groupController.getGroupSession);

  router.get(`${prefix}/list`, checkPrivileges, groupController.index);

  router.get(
    `${prefix}/option`,
    checkPrivileges,
    groupController.getGroupOption
  );

  router.put(`${prefix}/update/:id`, checkPrivileges, groupController.update);

  router.post(`${prefix}`, checkPrivileges, groupController.create);
};
