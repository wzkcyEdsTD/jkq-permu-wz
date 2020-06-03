/*
 * @Author: eds
 * @Date: 2020-06-03 14:25:27
 * @LastEditTime: 2020-06-03 15:41:54
 * @LastEditors: eds
 * @Description:
 * @FilePath: \jkq-permu-wz\app\model\LoginLogModel.js
 */

module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;
  const LoginLogModel = app.model.define(
    "loginlog",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      } /** 自增id */,
      username: {
        type: STRING(),
        allowNull: false,
      } /** 用户名 */,
      ip: {
        type: STRING(),
        allowNull: false,
      } /** ip地址 */,
    },
    {
      freezeTableName: false,
      timestamps: true,
      updatedAt: false,
      tableName: "loginlog",
    }
  );

  /**
   * 联表查询
   */
  LoginLogModel.associate = function () {
    app.model.LoginLogModel.hasOne(app.model.UserModel, {
      foreignKey: "username",
      sourceKey: "username",
    });
  };

  return LoginLogModel;
};
