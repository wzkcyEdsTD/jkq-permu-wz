/**
 * 企业年度信息(含年份号)
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;
  const CompanyPchModel = app.model.define(
    "company_pch",
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
      name: {
        type: STRING(50),
        allowNull: false,
      } /** 企业名称 */,
      street: {
        type: STRING(10),
        allowNull: false,
      } /** 所属街道 */,
      legal: {
        type: STRING(10),
        allowNull: true,
      } /** 企业法人代表 */,
      legalphone: {
        type: STRING(11),
        allowNull: true,
      } /** 企业法人代表电话 */,
      link: {
        type: STRING(10),
        allowNull: true,
      } /** 企业联系人 */,
      linkphone: {
        type: STRING(11),
        allowNull: true,
      } /** 企业联系人电话 */,
      scale: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
      } /** 企业规模([0]规下企业[1]规上企业) */,
      state: {
        type: INTEGER,
        allowNull: false,
        defaultValue: 0,
      } /** 企业状态([0]正常[1]非本街道[2]注销[3]迁出[4]迁入保护) */,
    },
    {
      freezeTableName: false,
      timestamps: false,
      tableName: "companypch",
    }
  );

  CompanyPchModel.associate = function () {
    app.model.CompanyPchModel.hasOne(app.model.CompanyMjDataModel, {
      foreignKey: "uuid",
    });
    app.model.CompanyPchModel.hasOne(app.model.CompanyMjDataModel, {
      foreignKey: "pch",
    });
    app.model.CompanyPchModel.hasOne(app.model.CompanyMjElecModel, {
      foreignKey: "uuid",
    });
    app.model.CompanyPchModel.hasOne(app.model.CompanyMjElecModel, {
      foreignKey: "pch",
    });
    app.model.CompanyPchModel.hasMany(app.model.CompanyMjLandModel, {
      foreignKey: "uuid",
    });
    app.model.CompanyPchModel.hasMany(app.model.CompanyMjLandModel, {
      foreignKey: "pch",
    });
  };

  return CompanyPchModel;
};
