const sequelize = require('sequelize');
const con = require('./connection');

//create table using schema
var smtpSchema = con.define('ig_smtp_details',{
    email : {
        type : sequelize.STRING
    },
    password : {
        type : sequelize.STRING
    },
    service : {
        type : sequelize.STRING
    },
    host : {
        type : sequelize.STRING
    },
    port : {
        type : sequelize.STRING
    },
    status : {
        type : sequelize.STRING,
        defaultValue : 1
    }
});

module.exports = smtpSchema
