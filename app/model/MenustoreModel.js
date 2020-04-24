/**
 * menustore 菜单关系图
 * @param {*} app
 */
module.exports = (app) => {
  const { INTEGER, STRING } = app.Sequelize;

  const MenustoreModel = app.model.define(
    "menustore",
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      //  额外存放的菜单关系
      menus: {
        type: STRING,
        allowNull: false,
        defaultValue: `[{"id":1}]]`,
      },
    },
    {
      timestamps: false,
      tableName: "menustore",
    }
  );

  return MenustoreModel;
};
