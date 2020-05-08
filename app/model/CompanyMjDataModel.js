/**
 * 企业指标信息(含年份号)
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, FLOAT } = app.Sequelize;
  const CompanyMjDataModel = app.model.define(
    "company_mj_data",
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
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 实缴税金(万) */,
      revenue: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 主营业收入(万) */,
      industrial: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 工业增加值(万) */,
      energy: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 综合能耗(吨标煤) */,
      rde: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 研发经费(万) */,
      staff: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 年平均员工数 */,
      taxtime: {
        type: STRING,
        allowNull: true,
      } /** 纳税时间 */,
      sewage: {
        type: FLOAT,
        allowNull: false,
        defaultValue: 0,
      } /** 排污量(吨) */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "companymjdata",
    }
  );

  CompanyMjDataModel.associate = function () {
    app.model.CompanyMjDataModel.belongsTo(app.model.CompanyPchModel, {
      foreignKey: "uuid",
    });
  };

  return CompanyMjDataModel;
};
