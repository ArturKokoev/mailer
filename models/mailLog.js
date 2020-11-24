const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

//create table using schema
var mailSchema = con.define('ig_mail_log',{
    email : {
        type : sequelize.STRING  
    },
    camp_id : {
        type : sequelize.INTEGER
    },
    grp_id : {
        type : sequelize.INTEGER
    },
    user_id : {
        type : sequelize.INTEGER  
    },
    status : {
        type : sequelize.STRING
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

module.exports = mailSchema
