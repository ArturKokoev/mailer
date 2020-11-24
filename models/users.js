const sequelize = require('sequelize');
const con = require('./connection');

//model require
const Campaign = require('./campaign');
const Contact = require('./contacts');
const Group = require('./group');
const smtp = require('./smtpDetails');

//create table using schema
var userSchema = con.define('ig_users',{
    email : {
        type : sequelize.STRING,
        allowNull : false
    },
    full_name : {
        type : sequelize.STRING,
        allowNull : false
    },
    password : {
        type : sequelize.STRING,
        allowNull : false
    },
    resetPasswordToken : {
        type : sequelize.STRING
    },
    status : {
        type : sequelize.STRING,
        defaultValue : 1
    }
});

con.sync()
.then(()=>{
    console.log('table created')
}).catch((err)=>{
    console.log(err)
    console.log('table not created')
});

//relation between campaign and users
userSchema.hasMany(Campaign,{foreignKey:'user_id', onDelete:'cascade'});
Campaign.belongsTo(userSchema,{foreignKey:'user_id'});

//relation between users and contacts
userSchema.hasMany(Contact,{foreignKey:'user_id', onDelete:'cascade'});
Contact.belongsTo(userSchema,{foreignKey:'user_id'});

//relation between users and groups
userSchema.hasMany(Group,{foreignKey:'user_id', onDelete:'cascade'});
Group.belongsTo(userSchema,{foreignKey:'user_id'});

//relation between smtp and users
userSchema.hasMany(smtp,{foreignKey:'user_id', onDelete:'cascade'});
smtp.belongsTo(userSchema,{foreignKey:'user_id'});

module.exports = userSchema
