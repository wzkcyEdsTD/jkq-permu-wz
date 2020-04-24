module.exports = app => {
  const { INTEGER, STRING, TEXT } = app.Sequelize;
  const UserJobRelation = app.model.define(
    'UserJobRelation',
    {
      id: {
        type: INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },
      job_users: {
        type: INTEGER,
        allowNull: false
      },
      user_jobs: {
        type: INTEGER,
        allowNull: false
      }
    },
    {
      freezeTableName: false,
      tableName: 'job_users__user_jobs',
      timestamps: false
    }
  );

  return UserJobRelation;
};
