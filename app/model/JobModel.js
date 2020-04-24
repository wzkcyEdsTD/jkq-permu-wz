/**
 * job 职能
 * @param {*} app
 */
module.exports = app => {
  const { INTEGER, STRING } = app.Sequelize;

  const JobModel = app.model.define(
    'job',
    {
      id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: STRING,
        allowNull: false
      }
    },
    {
      timestamps: false,
      tableName: 'job'
    }
  );

  JobModel.associate = function() {
    // app.model.JobModel.belongsToMany(app.model.UserModel, {
    //   through: app.model.UserJobRelation,
    //   foreignKey: 'job_users',
    //   otherKey: 'user_jobs'
    // });
  };
  return JobModel;
};
