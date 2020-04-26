/**
 * menu 菜单
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const MenuModel = app.model.define(
    'menu',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      level: {
        type: INTEGER(11),
        allowNull: false
      },
      label: {
        type: STRING,
        allowNull: false
      },
      //  antd 图标 新版新增字段
      anticon: {
        type: STRING
      },
      p_link: {
        type: STRING,
        allowNull: false
      },
      order: {
        type: INTEGER(11),
        allowNull: false
      },
      isAdminOnly: {
        type: INTEGER(1),
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'menu'
    }
  );

  MenuModel.associate = function() {
    app.model.MenuModel.belongsToMany(app.model.GroupModel, {
      through: app.model.GroupMenuRelation,
      foreignKey: 'menu_groups',
      otherKey: 'group_menus'
    });
  };

  return MenuModel;
};
