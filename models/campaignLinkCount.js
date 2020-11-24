const sequelize = require('sequelize');
const con = require('./connection');

//create table using schema
var linkSchema = con.define('ig_campaign_linkcount',{
    count : {
        type : sequelize.STRING
    },
    URL : {
        type : sequelize.STRING
    },
    campaign_id : {
        type : sequelize.INTEGER
    },
    status : {
        type : sequelize.STRING,
        defaultValue : 1
    }
});

module.exports = linkSchema
