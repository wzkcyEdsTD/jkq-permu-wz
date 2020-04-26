/**
 * passport md5加密
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING, DATE, UUID, UUIDV4 } = app.Sequelize;

  const PassportModel = app.model.define(
    'passport',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user: {
        type: INTEGER(11),
        allowNull: false
      },
      p_password: {
        type: STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'passport'
    }
  );

  PassportModel.associate = function() {
    app.model.PassportModel.belongsTo(app.model.UserModel, {
      foreignKey: 'user'
    });
  };

  return PassportModel;
};
