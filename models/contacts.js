const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

const mailLog = require('./mailLog');

//create table using schema
var contactSchema = con.define('ig_contacts',{
    name : {
        type : sequelize.STRING,
        allowNull : false
    },
    email : {
        type : sequelize.STRING,
        allowNull : false
    },
    status : {
        type : sequelize.STRING,
        defaultValue : 1
    },
    createdAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('createdAt');
            return moment(rawValue).format('ll');
        }
    },
    updatedAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('updatedAt');
            return moment(rawValue).format('ll');
        }
    }

});

module.exports = contactSchema
