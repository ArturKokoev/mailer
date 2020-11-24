const sequelize = require('sequelize');
const moment = require('moment');
const con = require('./connection');

//model require
const schMail = require('./sch_email');
const mailLog = require('./mailLog');

//create table using schema
var scheduleSchema = con.define('ig_schedule',{
    schedule_time :{
        type : sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('schedule_time');
            return moment(rawValue).format('MM/DD/YYYY hh:mm A');
        }
    },
    subject :{
        type : sequelize.STRING
    },
    count : {
        type : sequelize.INTEGER
    }, 
    email :{
        type : sequelize.STRING
    },
    user_id :{
        type : sequelize.STRING
    },
    status : {
        type : sequelize.STRING
    },
    createdAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('createdAt');
            return moment(rawValue).format('MM/DD/YYYY');
        }
    },
    updatedAt: {
        type: sequelize.DATE,
        get: function(fieldName) {
            const rawValue = this.getDataValue('updatedAt');
            return moment(rawValue).format('MM/DD/YYYY');
        }
    }
});

//relation between schedule and schedule email.
scheduleSchema.hasMany(schMail,{foreignKey:'sch_id', onDelete : 'cascade'});
schMail.belongsTo(scheduleSchema,{foreignKey:'sch_id'});

//relation between schedule and email log.
scheduleSchema.hasMany(mailLog,{foreignKey:'sch_id', onDelete : 'cascade'});
mailLog.belongsTo(scheduleSchema,{foreignKey:'sch_id'});

module.exports = scheduleSchema
