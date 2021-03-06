/*
 * @Author: eds
 * @Date: 2020-04-27 18:37:41
 * @LastEditTime: 2020-06-02 19:24:37
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\model\CompanyMjElecModel.js
 */ 
/**
 * 企业用电信息(含年份号)
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, FLOAT } = app.Sequelize;
  const CompanyMjElecModel = app.model.define(
    "company_mj_elec",
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
      } /** 统一社会信用代码 */,
      elecmeter: {
        type: STRING,
        allowNull: true,
        primaryKey: true,
      } /** 企业电表号 */,
      elec: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 年度用电量(千瓦时) */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companymjelec",
    }
  );

  CompanyMjElecModel.associate = function () {
    app.model.CompanyMjElecModel.belongsTo(app.model.CompanyPchModel, {
      foreignKey: "uuid",
      targetKey: "uuid",
    });
  };

  return CompanyMjElecModel;
};
