/*
 * @Author: eds
 * @Date: 2020-05-28 19:23:32
 * @LastEditTime: 2020-06-03 14:50:13
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\model\CompanyEvidenceModel.js
 */

module.exports = app => {
  const { INTEGER, STRING, BOOLEAN } = app.Sequelize;
  const CompanyEvidenceModel = app.model.define(
    "company_evidence",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      } /** 自增id */,
      pch: {
        type: STRING(4),
        allowNull: false,
      } /** 年份 */,
      uuid: {
        type: STRING(18),
        allowNull: false,
      } /** 统一社会信用代码 */,
      filename: {
        type: STRING,
        allowNull: false,
      } /** 文件名称 */,
      fileurl: {
        type: STRING,
        allowNull: false,
      } /** 文件路径 */,
      operator: {
        type: STRING,
        allowNull: false,
      } /** 操作人 */,
      enable: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: true,
      } /** 是否生效[1]生效[0]失效 */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      updatedAt: false,
      tableName: "companyevidence",
    }
  );

  CompanyEvidenceModel.associate = function () {
    app.model.CompanyEvidenceModel.belongsTo(app.model.CompanyPchModel, {
      foreignKey: "uuid",
      targetKey: "uuid",
    });
  };

  return CompanyEvidenceModel;
};
