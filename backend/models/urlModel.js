const Datatypes = require('sequelize');
const { sequelize } = require('../config/database');

const UrlModel = sequelize.define('Url', {
    id: {
        type: Datatypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    url: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true
    },
    shortCode: {
        type: Datatypes.STRING,
        allowNull: false,
        unique: true
    },
    createdAt: {
        type: Datatypes.DATE,
        defaultValue: Datatypes.NOW
    },
    updatedAt: {
        type: Datatypes.DATE,
        defaultValue: Datatypes.NOW
    }
})

module.exports = UrlModel;