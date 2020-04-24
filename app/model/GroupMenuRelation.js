module.exports = app => {
    const { INTEGER, STRING, TEXT } = app.Sequelize;
    const GroupMenuRelation = app.model.define('GroupMenuRelation', {
        id: {
            type: INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true
        },
        group_menus: {
            type: INTEGER,
            allowNull: false
        },
        menu_groups: {
            type: INTEGER,
            allowNull: false
        }
    }, {
            freezeTableName: false,
            tableName: 'group_menus__menu_groups',
            timestamps: false
        });

    return GroupMenuRelation;
}