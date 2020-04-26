module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    console: { userController }
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = '/api/user';

  router.post(`${prefix}/login`, userController.login);
  router.post(`${prefix}/register`, userController.register);
  router.post(`${prefix}`, checkPrivileges, userController.create);

  router.get(`${prefix}/list`, checkPrivileges, userController.index);
  router.get(`${prefix}/logout`, userController.logout);
  router.get(`${prefix}/session`, userController.getUserSession);
  router.get(`${prefix}/:userId`, checkPrivileges, userController.show);

  router.put(`${prefix}/:userId`, checkPrivileges, userController.update);

  router.put(`${prefix}/resetPassword/:userId`, userController.resetPassword);
  router.put(
    `${prefix}/adminResetPassword/:userId`,
    userController.adminResetPassword
  );
  router.put(
    `${prefix}/updateToAdmin/:userId`,
    checkPrivileges,
    userController.updateToAdmin
  );

  router.delete(
    `${prefix}/delete/:userId`,
    checkPrivileges,
    userController.delete
  );

  router.get(
    `${prefix}/job/option`,
    checkPrivileges,
    userController.getJobOption
  );
  router.get(
    `${prefix}/department/option`,
    checkPrivileges,
    userController.getDepartmentOption
  );
};
