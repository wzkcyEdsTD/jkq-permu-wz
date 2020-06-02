/*
 * @Author: eds
 * @Date: 2020-05-11 10:59:52
 * @LastEditTime: 2020-06-02 19:23:39
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\model\CompanyElecmeterModel.js
 */ 
/**
 * [Log] 共用电表登记记录
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, FLOAT, BOOLEAN } = app.Sequelize;
  const CompanyElecmeterModel = app.model.define(
    "company_elecmeter",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      } /** 自增id */,
      pch: {
        type: STRING(4),
        allowNull: false,
      } /** 年份 */,
      elecmeter: {
        type: STRING,
        allowNull: false,
      } /** 企业电表号 */,
      elec: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 年度用电量(千瓦时) */,
      operator: {
        type: STRING,
        allowNull: false,
      } /** 操作人唯一标志(username) */,
      companys: {
        type: STRING,
        allowNull: false,
      } /** 共用电表json */,
      enable: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true,
      } /** 该记录是否有效 */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companyelecmeter",
    }
  );

  return CompanyElecmeterModel;
};
