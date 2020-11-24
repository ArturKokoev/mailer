const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

//create table using schema
var scheduleEmailSchema = con.define('ig_schedule_email',{
    email : {
        type : sequelize.STRING  
    },
    status : {
        type : sequelize.STRING
    },
    cmp_id : {
        type : sequelize.INTEGER
    },
    createdAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('createdAt');
            return moment(rawValue).format('YYYY-MM-DD');
        }
    },
    updatedAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('updatedAt');
            return moment(rawValue).format('YYYY-MM-DD');
        }
    }
});

module.exports = scheduleEmailSchema
