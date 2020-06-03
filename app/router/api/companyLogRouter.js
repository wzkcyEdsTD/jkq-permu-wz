/*
 * @Author: eds
 * @Date: 2020-06-03 11:38:38
 * @LastEditTime: 2020-06-03 11:40:35
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\router\api\companyLogRouter.js
 */

module.exports = app => {
  const { router, controller } = app;
  const {
    mjLog: { companyLogController },
  } = controller;
  const prefix = "/api/mjLog";

  router.post(
    `${prefix}/companyle`,
    companyLogController.getCompanyEvidenceList
  );
  router.post(`${prefix}/loginlog`, companyLogController.getLoginLogList);
};
