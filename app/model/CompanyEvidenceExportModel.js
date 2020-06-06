/*
 * @Author: eds
 * @Date: 2020-06-06 17:23:44
 * @LastEditTime: 2020-06-06 17:24:30
 * @LastEditors: eds
 * @Description: 
 * @FilePath: \jkq-permu-wz\app\model\CompanyEvidenceExportModel.js
 */ 
module.exports = app => {
    const { INTEGER, STRING, BOOLEAN } = app.Sequelize;
    const CompanyEvidenceExportModel = app.model.define(
      "company_evidence_export",
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
        tableName: "companyevidenceexport",
      }
    );
  
    CompanyEvidenceExportModel.associate = function () {
      app.model.CompanyEvidenceExportModel.belongsTo(app.model.CompanyPchModel, {
        foreignKey: "uuid",
        targetKey: "uuid",
      });
    };
  
    return CompanyEvidenceExportModel;
  };
  