var url = require('url');
var crypto = require('crypto');
var { sequelize, Op } = require('sequelize');
var cron = require('node-cron');

//require models 
const Campaign = require('../models/campaign');
const Users = require('../models/users');
const Contact = require('../models/contacts');
const Group = require('../models/group');
const linkCount = require('../models/campaignLinkCount');
const MailLog = require('../models/mailLog');
const Schedule = require('../models/schedule');
const schMail = require('../models/sch_email');
const smtpDetails = require('../models/smtpDetails');
const sendMail = require('../config/mailapi');

cron.schedule("* * * * *", function () {
    cronSchedule();
});

//get all campaign.
module.exports.getCampaigns = (req, res)=>{
    if(req.session.Id){
        Campaign.findAll({where: {user_id:req.session.Id}}).then(result=>{
            Contact.findAll({where: {user_id:req.session.Id}}).then(conDetails=>{
                Group.findAll({where: {user_id:req.session.Id}, include: [{ model: Contact, attributes: ['id']}]}).then(grpDetails=>{
                    res.render('campaigns',{campaign : result, conDetails:conDetails, grpDetails:grpDetails});
                }).catch(err=>{
                    res.json({status : false, message:'Group not found.'})
                });
            }).catch(err1=>{
                res.json({status : false, message:'Contact not found.'})
            });    
        }).catch(err2=>{
            res.json({status : false, message:'Campaign not found.'})
        });
    }else{
        res.redirect('/')
    }
}

//save create-campaign data.
module.exports.postCreateCampaigns = (req, res)=>{
    var campaign_name = req.body.campaign_name
    var template = req.body.data
    var id = req.body.id
    var link
    if(req.body.link){
        var ll = JSON.parse(req.body.link)
        link = ll.toString();
    }
    
    if(campaign_name){
        Campaign.findOne({where : {campaign_name:campaign_name, user_id:req.session.Id}}).then((result)=>{
            if(result){
                res.json({status : false, message : 'Campaign already exists..Try another.'})
            }else{
                Campaign.create({campaign_name : campaign_name, user_id: req.session.Id}).then((addCampaign)=>{ 
                    res.json({status : true, message : 'Campaign created.', data : addCampaign})
                }).catch((err)=>{
                    res.json({status : false, message : 'Campaign not created.'})
                });
            }
        }).catch((err1)=>{
            res.json({status : false, message : 'Campaign not find.'})
        });
    }else{
        var temp_trim = template.trim();
        Campaign.update({font_family:link, template : temp_trim},{where : {id : id}}).then((updatedCamp)=>{
            res.json({status : true, message : 'Campaign updated.'})
        }).catch((err)=>{
            res.json({status : false, message : 'Campaign not updated.'})
        });
    }
}

module.exports.dataLink=(req, res)=>{
    var id = req.body.id
        Campaign.findOne({where :{id : id}}).then((findData)=>{ 
            res.json({status:true,findData : findData});
        }).catch((err)=>{
            res.json({status : false, message:'Campaign not found'})
        });
}

//get create-campaign page.
module.exports.getCreateCampaigns = (req, res)=>{
    if(req.session.Id){
        res.render('create-campaign',{campaignData : ''});
    }else{
        res.redirect('/')
    }
}

//edit campaign api call.
module.exports.campaignId = (req, res)=>{ 
    if(req.session.Id){
        var id = req.params.id
        Campaign.findOne({where :{id : id}}).then((getData)=>{ 
            var dataId = encrypt(id)
            res.render('create-campaign',{campaignData : getData,id : dataId});
        }).catch((err)=>{
            res.json({status : false,message:'Campaign not found.'})
        });
    }else{
        res.redirect('/')
    }
}

//image save in local storage
module.exports.imageSave = (req, res)=>{ 
    var file = req.file.filename
    res.json({status : true, image : file})
}

//delete campaign.
module.exports.campaignDelete = (req, res)=>{
    Campaign.destroy({where : {id : req.body.id}}).then(deleted =>{
        res.json({status:true, message:'Campaign deleted.'})
    }).catch(err=>{
        res.json({status : false, message:'Campaign not deleted.'}) 
    })
}

//show preview template
module.exports.previewTemplate=(req, res)=>{
    Campaign.findOne({where : {id : req.body.id}}).then(camData =>{
        res.json({status:true, data : camData})
    }).catch(err=>{
        res.json({status : false, message:'Campaign not found.'}) 
    })
}

//get link count
module.exports.getLink = (req, res)=>{ 
    const queryObject = url.parse(req.url,true).query; 
    var id = req.params.id
    var decryptId = decrypt(id)
    linkCount.findOne({where : {campaign_id : decryptId,URL:queryObject.url}}).then(findData=>{ 
        if(findData){ 
            linkCount.increment('count', { by: 1,where:{campaign_id:decryptId ,URL:queryObject.url}})
            .then(newData=>{
                res.writeHead(301, { "Location": queryObject.url });
                return res.end();
            }).catch(err1=>{
                res.json({status:false, message:'Count not updated.'})
            });
        }else{ 
            var cont = CountFun();
            linkCount.create({count:cont, URL:queryObject.url, campaign_id:decryptId}).then(newData=>{
                res.writeHead(301, { "Location": queryObject.url });
                return res.end();
            }).catch(err1=>{
                res.json({status:false, message:'Click not Count.'})
            });
        }
    }).catch(err=>{
        res.json({status:false, message: 'Id not exists.'})
    });
}

//send mail to the user
module.exports.mailSend=(req, res)=>{ 
    var id = req.body.id
    var subject = req.body.subject
    var email = req.body.email
    var group = req.body.group
    var time = req.body.time
    var contactId
    if(req.body.contactId){
        contactId = JSON.parse(req.body.contactId)
    }

    Campaign.findOne({where:{id : id}}).then(async campData=>{ 
        smtpDetails.findOne({where:{user_id:campData.user_id}}).then(async smtpdetails=>{
            if(campData != null && smtpdetails != null){
                if(group){ 
                    Contact.findAll({attributes:["email"],where:{group_id:group}}).then(async grpData=>{
                        if(time){
                            Schedule.create({schedule_time : time, subject:subject, count:grpData.length, user_id:req.session.Id, group_id:group, status: 0}).then(async schData=>{ 
                                let grpArray = [];
                                grpData.forEach(function(grpEmail){
                                    grpArray.push({'email': grpEmail.email, 'sch_id' :schData.id, 'cmp_id':id, 'status':'0'})
                                });
                                //bulk create of schedule Email.
                                schMail.bulkCreate(grpArray).then(schMailData =>{
                                    res.json({status:true,message:'schedule email added.'})
                                }).catch(err=>{
                                    res.json({status:false,message:'schedule email not added.'})
                                });
                            }).catch(err=>{
                                res.json({status:false, message:'schedule not added.'})
                            });
                        }else{
                            var emailData =   []; 
                            grpData.forEach(element => {
                                emailData.push(element.email)
                            });
                            var chunkSize = 2; 
                            var mailList = splitArray(emailData, chunkSize);   
                            let getData = await sendMail(smtpdetails, campData, subject, mailList);
                            if(getData.messageId){
                                res.json({status : true, message : 'Email send.....Please check your mail inbox!'})
                            }else{
                                res.json({status : false, message : 'We are not able to send email now, please try after sometime!'})
                            }
                        }
                    });
                }else if(contactId){
                    Contact.findAll({attributes: ['email'], where :{id :{[Op.in]: contactId}}}).then(async conData=>{
                        if(time != ''){ 
                            Schedule.create({schedule_time : time, subject:subject, count:conData.length,user_id:req.session.Id,email:'email',status: 0}).then(async schData=>{ 
                                let conArray = [];
                                conData.forEach(function(conEmail){
                                    conArray.push({'email': conEmail.email, 'sch_id' :schData.id, 'cmp_id':id, 'status':'0'})
                                });
                                //bulk create of schedule Email.
                                schMail.bulkCreate(conArray).then(schMailData =>{
                                    res.json({status:true,message:'Schedule successfully created.'})
                                }).catch(err=>{
                                    res.json({status:false,message:'Schedule  not created.'});
                                });
                            }).catch(err=>{
                                res.json({status:false, message:'schedule not created.'})
                            });
                        }else{ 
                            var emailData =   []; 
                            conData.forEach(element => {
                                emailData.push(element.email)
                            });
                            var chunkSize = 2; 
                            var mailList = splitArray(emailData, chunkSize);
                            let getData = await sendMail(smtpdetails, campData, subject, mailList);
                            if(getData.messageId){
                                res.json({status : true, message : 'Email send.....Please check your mail inbox!'})
                            }else{
                                res.json({status : false, message : 'We are not able to send email now, please try after sometime!'})
                            }
                        }
                    }).catch(err1=>{
                        res.json({status:false,message:'Can not find any contact.'})
                    });
                }else{
                    let getData = await sendMail(smtpdetails, campData, subject, email);
                    console.log(getData)
                    if(getData.messageId){
                        return res.json({status : true, message : 'Email send.....Please check your mail inbox!'})
                    }else{
                        return res.json({status : false, message : 'We are not able to send email now, please try after sometime!'})
                    }        
                }
            }else{
                res.json({status:false, message:'Please fill smtp details.'}); 
            }
        }).catch(err1=>{
            res.json({status:false, message:'Can not found smtp details.'})
        });
    }).catch(err=>{
        res.json({status:false, message:'Campaign not found.'})
    });
}

var cnt=0;
function CountFun() {
    cnt=parseInt(cnt)+parseInt(1);
    return cnt;
}

function encrypt(id){
	var cipher = crypto.createCipher('aes-256-cbc','d6F3Efeq')
	var crypted = cipher.update(id,'utf8','hex')
	crypted += cipher.final('hex');
	return crypted;
}

function decrypt(id){
	var decipher = crypto.createDecipher('aes-256-cbc','d6F3Efeq')
	var dec = decipher.update(id,'hex','utf8')
	dec += decipher.final('utf8');
	return dec;
}

function splitArray(emailData, chunkSize) {
    return Array(Math.ceil(emailData.length/chunkSize)).fill().map(function(_,i) {
        return emailData.slice(i * chunkSize, i * chunkSize + chunkSize);
    });
}

function cronSchedule(){
    const d = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Calcutta'
    });
    Schedule.findAll({where : {'schedule_time':d}}).then(result=>{
        if(result.length > 0){
            MailLog.create({'email':result.id}).then(async addMailLog=>{}).catch(er1=>{});
            result.forEach(element => {
                schMail.findAll({attributes: ['email','cmp_id'],where:{'sch_id':element.id}}).then(async findEmail=>{
                    smtpDetails.findOne({where:{user_id:element.user_id}}).then(details=>{
                        for(let i=0; i<findEmail.length; i++){
                            Campaign.findOne({where:{'id':findEmail[i].cmp_id}}).then(async findCamp=>{
                                let getData = await sendMail(details, findCamp, element.subject, findEmail[i].email);
                                if(getData.messageId){
                                    MailLog.create({
                                        'email':findEmail[i].email,
                                        'camp_id':findEmail[i].cmp_id,
                                        'grp_id':element.group_id,
                                        'user_id':element.user_id,
                                        'sch_id':element.id,
                                        'status':'1'
                                    }).then(async addMailLog=>{
                                        if(addMailLog){
                                            schMail.destroy({where:{sch_id : element.id}}).then(async delSchMail=>{
                                            }).catch(er=>{});
                                        }
                                    }).catch(er1=>{
                                        console.log(er1)
                                    });
                                }else{
                                    MailLog.create({
                                        'email':findEmail[i].email,
                                        'camp_id':findEmail[i].cmp_id,
                                        'grp_id':element.group_id,
                                        'user_id':element.user_id,
                                        'sch_id':element.id,
                                        'status':'0'
                                    }).then(async addMailLog=>{
                                        if(addMailLog){
                                            schMail.destroy({where:{sch_id : element.id}}).then(async delSchMail=>{}).catch(er=>{});
                                        }
                                    }).catch(er1=>{
                                        console.log(er1)
                                    });
                                }        
                            }).catch(err=>{
                                console.log(err)
                            });
                        }
                    });
                });
                Schedule.update({'status':'1'},{where:{id:element.id}}).then(async updateSch=>{}).catch(er2=>{});
            }); 
        }else{
            console.log('cron running.')
        }
    }).catch(err1 =>{
        console.log(err1)
    });
}
