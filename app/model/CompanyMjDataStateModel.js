/**
 * 企业指标信息状态确认表(含年份号)
 * [true]确认 [false]未确认
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, BOOLEAN } = app.Sequelize;
  const CompanyMjDataStateModel = app.model.define(
    "company_mj_data_state",
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
      tax: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 实缴税金(万) */,
      revenue: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 主营业收入(万) */,
      industrial: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 工业增加值(万) */,
      energy: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 综合能耗(吨标煤) */,
      rde: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 研发经费(万) */,
      staff: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 年平均员工数 */,
      taxtime: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 纳税时间 */,
      sewage: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 排污量 */,
      land: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 用地确认 */,
      elec: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      } /** 用电确认 */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companymjdatastate",
    }
  );

  CompanyMjDataStateModel.associate = function () {
    app.model.CompanyMjDataStateModel.belongsTo(app.model.CompanyPchModel, {
      foreignKey: "uuid",
    });
  };

  return CompanyMjDataStateModel;
};
