const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

//create table using schema
var campaignSchema = con.define('ig_campaign',{
    campaign_name : {
        type : sequelize.STRING,
        allowNull : false
    },
    font_family : {
        type : sequelize.STRING
    },
    template : {
        type : sequelize.TEXT
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

con.sync({ alter: true });

module.exports = campaignSchema
