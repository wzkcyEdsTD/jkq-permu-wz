/**
 * 用户信息
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4 } = app.Sequelize;

  const UserModel = app.model.define(
    "publish_user",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: STRING(50),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: STRING(20),
        allowNull: true,
      },
      isActive: {
        type: INTEGER(1),
        allowNull: false,
        defaultValue: 0,
      },
      role: {
        type: INTEGER(4),
        allowNull: true,
      },
      department: {
        type: INTEGER(10),
        allowNull: true,
      },
    },
    {
      freezeTableName: false,
      timestamps: false,
      tableName: "user",
    }
  );

  UserModel.beforeBulkUpdate(({ attributes }) => {
    attributes.updateTime = new Date();
  });

  /**
   * 联表查询
   */
  UserModel.associate = function () {
    app.model.UserModel.hasOne(app.model.PassportModel, {
      foreignKey: "user",
      targetKey: "id",
    });
    // app.model.UserModel.belongsTo(app.model.DepartmentModel, {
    //   foreignKey: "department",
    // });
    app.model.UserModel.belongsToMany(app.model.GroupModel, {
      through: app.model.UserGroupRelation,
      foreignKey: "user_groups",
      otherKey: "group_users",
    });
    // app.model.UserModel.belongsToMany(app.model.JobModel, {
    //   through: app.model.UserJobRelation,
    //   foreignKey: "user_jobs",
    //   otherKey: "job_users",
    // });
  };

  return UserModel;
};
