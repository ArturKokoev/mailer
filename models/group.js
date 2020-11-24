const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

//require models
const Contact = require('./contacts');
const Schedule = require('./schedule');

//create table using schema
var groupSchema = con.define('ig_group',{
    name : {
        type : sequelize.STRING,
        allowNull : false
    },
    status : {
        type : sequelize.STRING,
        defaultValue : 1
    }
});

//relation between group and contact
groupSchema.hasMany(Contact,{foreignKey:'group_id', onDelete:'cascade'});
Contact.belongsTo(groupSchema,{foreignKey:'group_id'});

//relation between Schedule and group
groupSchema.hasMany(Schedule,{foreignKey:'group_id', onDelete:'cascade'});
Schedule.belongsTo(groupSchema,{foreignKey:'group_id'});

module.exports = groupSchema
