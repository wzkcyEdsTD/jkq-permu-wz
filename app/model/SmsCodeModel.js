/*
 * @Author: eds
 * @Date: 2020-05-27 10:21:46
 * @LastEditTime: 2020-05-27 10:34:18
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\model\SmsCodeModel.js
 */

/**
 * 短信机
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const SmsCodeModel = app.model.define(
    "sms_code",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      } /** 自增id */,
      masid: {
        type: STRING,
        allowNull: false,
      } /** OpenMas短信返回id */,
      phone: {
        type: STRING,
        allowNull: false,
      } /** 手机号 */,
      code: {
        type: STRING,
        allowNull: false,
      } /** OpenMas短信发送code */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      tableName: "smscode",
    }
  );

  return SmsCodeModel;
};
