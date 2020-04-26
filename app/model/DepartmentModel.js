/**
 * 部门
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const DepartmentModel = app.model.define(
    'publish_department',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: STRING(255),
        allowNull: false,
        unique: true
      },
      manager: {
        type: INTEGER(10),
        allowNull: false
      }
    },
    {
      freezeTableName: false,
      tableName: 'department',
      timestamps: false
    }
  );

  /**
   * 联表查询
   */
  // DepartmentModel.associate = function() {
  //   app.model.DepartmentModel.hasOne(app.model.UserModel, {
  //     foreignKey: 'department',
  //     targetKey: 'id'
  //   });
  // };

  return DepartmentModel;
};
