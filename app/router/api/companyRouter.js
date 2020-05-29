/*
 * @Author: eds
 * @Date: 2020-04-29 14:24:30
 * @LastEditTime: 2020-05-29 14:59:29
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\router\api\companyRouter.js
 */

module.exports = app => {
  const { router, controller, middleware } = app;
  const {
    mj: { companyController, companyEvidenceController },
  } = controller;
  const prefix = "/api/mj";
  const doLog = app.middleware.doLog();
  //  [companyController]
  router.post(`${prefix}/company`, companyController.getCompanyListByPch);
  router.post(
    `${prefix}/company/export`,
    companyController.exportCompanyListByPch
  );
  router.get(`${prefix}/company/:pch`, companyController.getCompanyInfoByPch);
  router.put(
    `${prefix}/company/:pch/:uuid`,
    companyController.updateCompanyInfoByPch
  );
  router.put(
    `${prefix}/company/:username`,
    companyController.updateCompanyPassport
  );
  router.post(
    `${prefix}/company/names`,
    companyController.fetchCompanyNameByUuid
  );
  router.put(
    `${prefix}/company/data/:pch/:uuid`,
    companyController.updateCompanyData
  );
  router.put(
    `${prefix}/company/state/:pch/:uuid`,
    companyController.updateCompanyDataState
  );
  router.put(
    `${prefix}/company/basic/:pch/:uuid`,
    companyController.companyUploadBasicSubmit
  );
  router.put(
    `${prefix}/company/elecmeter/:pch/:elecmeter`,
    companyController.updateCompanyElecmenter
  );
  router.get(
    `${prefix}/company/elecmeter/:pch/:uuid`,
    companyController.getCompanyElecmenter
  );
  // [companyEvidenceController]
  router.post(
    `${prefix}/evidence/upload/:pch/:uuid`,
    doLog,
    companyEvidenceController.uploadCompanyEvidence
  );
};
