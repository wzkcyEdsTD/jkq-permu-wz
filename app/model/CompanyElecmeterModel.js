/**
 * [Log] 共用电表登记记录
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, FLOAT } = app.Sequelize;
  const CompanyElecmeterModel = app.model.define(
    "company_elecmeter",
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
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companyelecmeter",
    }
  );

  return CompanyElecmeterModel;
};
