'use strict';
const { STRING } = require('sequelize');
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Clinic extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    };
    Clinic.init({
        name: DataTypes.STRING,
        address: DataTypes.STRING,
        descriptionMarkDown: DataTypes.TEXT,
        descriptionHTML: DataTypes.TEXT,
        image: DataTypes.BLOB('long')
    }, {
        sequelize,
        modelName: 'Clinic',
    });
    return Clinic;
};