module.exports = app => {
    const { INTEGER, STRING, TEXT } = app.Sequelize;
    const UserGroupRelation = app.model.define('UserGroupRelation', {
        id: {
            type: INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        group_users: {
            type: INTEGER,
            allowNull: false
        },
        user_groups: {
            type: INTEGER,
            allowNull: false
        }
    }, {
            freezeTableName: false,
            tableName: 'group_users__user_groups',
            timestamps: false
        });

    return UserGroupRelation;
}