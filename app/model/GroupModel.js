/**
 * group 组
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const GroupModel = app.model.define(
    'group',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: STRING,
        allowNull: false
      },
      isActive: {
        type: INTEGER(1),
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'group'
    }
  );

  GroupModel.associate = function() {
    app.model.GroupModel.belongsToMany(app.model.UserModel, {
      through: app.model.UserGroupRelation,
      foreignKey: 'group_users',
      otherKey: 'user_groups'
    });
    app.model.GroupModel.belongsToMany(app.model.MenuModel, {
      through: app.model.GroupMenuRelation,
      foreignKey: 'group_menus',
      otherKey: 'menu_groups'
    });
  };

  return GroupModel;
};
