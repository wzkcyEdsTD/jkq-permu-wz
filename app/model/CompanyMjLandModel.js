/*
 * @Author: eds
 * @Date: 2020-04-27 18:37:41
 * @LastEditTime: 2020-06-04 18:25:49
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\model\CompanyMjLandModel.js
 */

/**
 * 企业用电信息(含年份号)
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING, FLOAT } = app.Sequelize;
  const CompanyMjLandModel = app.model.define(
    "company_mj_land",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
      } /** 自增id */,
      pch: {
        type: STRING(4),
        allowNull: false,
        primaryKey: true,
      } /** 年份 */,
      uuid: {
        type: STRING(18),
        allowNull: false,
        primaryKey: true,
        defaultValue: "unknown",
      } /** 统一社会信用代码 */,
      type: {
        type: INTEGER,
        allowNull: false,
      } /** 用地来源([1]自有用地[0]租赁用地) */,
      area: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 用地面积(平方米) */,
      linktype: {
        type: INTEGER,
        allowNull: false,
      } /** 出租关联([1]企业[0]村.街道) */,
      to_object: {
        type: STRING,
        allowNull: false,
        primaryKey: true,
      } /** 出租关联对象([1]统一社会信用代码[0]街道@村) */,
      elecmeter: {
        type: STRING,
        allowNull: true,
        primaryKey: true,
        defaultValue: "",
      } /** 企业电表号 */,
      elec: {
        type: FLOAT,
        allowNull: true,
        defaultValue: 0,
      } /** 年度用电量(千瓦时) */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companymjland",
    }
  );

  CompanyMjLandModel.associate = function () {
    app.model.CompanyMjLandModel.belongsTo(app.model.CompanyPchModel, {
      foreignKey: "to_object",
      targetKey: "uuid",
    });
  };

  return CompanyMjLandModel;
};
