/*
 * @Author: eds
 * @Date: 2020-04-29 14:24:30
 * @LastEditTime: 2020-05-28 18:57:15
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\router\api\companyRouter.js
 */

module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    mj: { companyController, companyEvidenceController },
  } = controller;
  const checkPrivileges = middleware.checkPrivileges();
  const prefix = "/api/mj";
  //  [companyController]
  router.post(`${prefix}/company`, companyController.getCompanyListByPch);
  router.post(
    `${prefix}/company/export`,
    companyController.exportCompanyListByPch
  );
  router.get(
    `${prefix}/company/:pch`,
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
  router.post(
    `${prefix}/company/names`,
    checkPrivileges,
    companyController.fetchCompanyNameByUuid
  );
  router.put(
    `${prefix}/company/data/:pch/:uuid`,
    checkPrivileges,
    companyController.updateCompanyData
  );
  router.put(
    `${prefix}/company/state/:pch/:uuid`,
    checkPrivileges,
    companyController.updateCompanyDataState
  );
  router.put(
    `${prefix}/company/basic/:pch/:uuid`,
    checkPrivileges,
    companyController.companyUploadBasicSubmit
  );
  router.put(
    `${prefix}/company/elecmeter/:pch/:elecmeter`,
    checkPrivileges,
    companyController.updateCompanyElecmenter
  );
  router.get(
    `${prefix}/company/elecmeter/:pch/:uuid`,
    checkPrivileges,
    companyController.getCompanyElecmenter
  );
  // [companyEvidenceController]
  router.post(
    `${prefix}/evidence/upload/:pch/:uuid`,
    checkPrivileges,
    companyEvidenceController.uploadCompanyEvidence
  );
};
