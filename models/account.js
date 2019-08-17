/* eslint-disable func-names */

module.exports = (sequelize, DataTypes) => {
    const Account = sequelize.define('Account', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
        },
        tel: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
        },
        social: {
            type: DataTypes.ARRAY(DataTypes.JSONB),
            defaultValue: '{}',
        },
        jobKeyword: {
            type: DataTypes.ARRAY(DataTypes.STRING),
        },
    }, {});
    Account.associate = function (models) {
        Account.hasMany(models.Application, { as: 'applications' });
    };
    return Account;
};