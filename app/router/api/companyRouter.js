module.exports = (app) => {
  const { router, controller, middleware } = app;
  const {
    mj: { companyController },
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = "/api/mj";

  router.post(`${prefix}/company`, companyController.getCompanyListByPch);
  router.post(
    `${prefix}/company/export`,
    companyController.exportCompanyListByPch
  );
  router.post(
    `${prefix}/company/:pch/:uuid`,
    checkPrivileges,
    companyController.getCompanyInfoByPch
  );
  router.put(
    `${prefix}/company/:pch/:uuid`,
    checkPrivileges,
    companyController.updateCompanyInfoByPch
  );
  router.put(
    `${prefix}/company/:username`,
    checkPrivileges,
    companyController.updateCompanyPassport
  );
};
