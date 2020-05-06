module.exports = (app) => {
  const { router, controller, middleware } = app;
  const {
    mj: { companyController },
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = "/api/mj";

  router.get(`${prefix}/company`, companyController.getCompanyListByPch);
  router.get(
    `${prefix}/company/export`,
    companyController.exportCompanyListByPch
  );
  router.get(
    `${prefix}/company/:uuid/:pch`,
    checkPrivileges,
    companyController.getCompanyInfoByPch
  );
};