const bcrypt = require('bcrypt');

//model require
const Users = require('../models/users');
const MailLog = require('../models/mailLog');
const Schedule = require('../models/schedule');
const SchMail = require('../models/sch_email');
const Group = require('../models/group');
const smtpDetail = require('../models/smtpDetails');

module.exports.getSetting=(req,res)=>{
    if(req.session.Id){
        Users.findOne({where:{id:req.session.Id}}).then(findUser=>{
            Schedule.findAll({where:{user_id:findUser.id}, include: [{ model: Group, attributes: ['id','name']}]}).then(schData=>{
                MailLog.findAll({where:{user_id:findUser.id}}).then(deliverData=>{ 
                    smtpDetail.findOne({where:{user_id:findUser.id}}).then(smtpData=>{
                        res.render('settings',{user:findUser, smtpDetail:smtpData, schData:schData, deliverData:deliverData});
                    }).catch(er=>{
                        res.json({status:false, message:'cannot find any smtp detail.'})
                    });
                }).catch(err=>{
                    res.json({status:false, message:'cannot find any mail log.'})
                });
            }).catch(err1=>{
                res.json({status:false, message:'cannot find schedule.'})
            });
        }).catch(err2=>{
            res.json({status:false, message:'cannot find any user.'})
        });
    }else{
        res.redirect('/');
    }
}

module.exports.profileUpdate=(req, res)=>{
    var id = req.body.id
    var full_name = req.body.name
    var password = req.body.password
    Users.findOne({where : {id : id}}).then((result)=>{
        if(result){
            bcrypt.hash(password, 8, function(err, hash){
                Users.update({full_name:full_name, password:hash,resetPasswordToken:hash},{where:{id:id}}).then((updtUser)=>{ 
                    res.json({status : true, message : "User details updated."});
                }).catch((err1)=>{
                    res.json({status : false, error : err1,message:'User details not updated.'});
                });
            });
        }else{
            res.json({status : false, message : "Can not find any User."});
        }
    }).catch((err)=>{
        res.json({status : false, error : err});
    })
}

module.exports.getEditSchedule=(req, res)=>{
    var id = req.body.id
    Schedule.findOne({where:{id:id}}).then(result=>{
        res.json({status:true, getSch:result});
    }).catch(err=>{
        res.json({status:false, message:'Schedule not find.'})
    });
}

module.exports.updateSchedule=(req, res)=>{
    var id = req.body.id
    var time = req.body.time

    Schedule.update({schedule_time:time},{where:{id:id}}).then(result=>{
        res.json({status:true, message:'Schedule updated.'});
    }).catch(err=>{
        res.json({status:false, message:'Schedule not updated.'});
    });
}

module.exports.deleteSchedule=(req, res)=>{
    var id = req.body.id
    Schedule.destroy({where:{id:id}}).then(result=>{
        res.json({status:true, message:'Schedule deleted.'});
    }).catch(err=>{
        res.json({status:false, message:'Schedule not deleted.'})
    });
}

module.exports.deleteMailDelivery=(req, res)=>{
    MailLog.destroy({where:{id:req.body.id}}).then(delMail=>{
        res.json({status:true, message:'Mail Delivery data deleted.'});
    }).catch(err=>{
        res.json({status:false, message:'Mail Delivery data not deleted.'});
    })
}

module.exports.smptpDetailsCreate=(req, res)=>{
    var email = req.body.email
    var password =  req.body.pass
    var port =  req.body.port
    var host =  req.body.host
    var service =  req.body.service

    smtpDetail.create({email:email, password:password, port:port, host:host, service:service, user_id:req.session.Id}).then(addSmtp=>{
        res.json({status:true, data:addSmtp, message:'SMTP details added successfully.'})
    }).catch(err=>{
        res.json({status:false, message:'SMTP details not added.'})
    });
}

module.exports.smptpDetailsUpdate=(req, res)=>{
    var id = req.body.id
    var email = req.body.email
    var password =  req.body.pass
    var port =  req.body.port
    var host =  req.body.host
    var service =  req.body.service

    smtpDetail.update({email:email, password:password, port:port, host:host, service:service},{where:{id:id}}).then(updtSmtp=>{
        res.json({status:true,data:updtSmtp, message:'SMTP details updated successfully.'})
    }).catch(err=>{
        res.json({status:false, message:'SMTP details not updated.'})
    });
}