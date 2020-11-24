const bcrypt = require('bcrypt');
const User = require('../models/users');
const sendMail = require('../config/mailapi');
const details = require('../config/mail_setting.json');

module.exports.getRegister = (req, res)=>{
    res.render('register');
}

module.exports.registerUser = (req, res)=>{
    var email = req.body.email 
    var full_name = req.body.username
    var password = req.body.password
    User.findOne({where : {email : email}}).then((result)=>{
        if(result){
            res.json({status : false, message : "Email already exists...Try another."});
        }else{
            bcrypt.hash(password, 8, function(err, hash){
                var newUser = {
                    email : email,
                    full_name : full_name,
                    password : hash
                }
                User.create(newUser).then((addUser)=>{ 
                    res.json({status : true, message : "user registered!!"});
                }).catch((err1)=>{
                    res.json({status : false, error : err1, message : "user registered!!"});
                });
            });
        }
    }).catch((err)=>{
        res.json({status : false, error : err, message : "user not found!!"});
    })
}

module.exports.getLogin = (req, res)=>{
    res.render('index');
}

module.exports.loginUser = (req, res)=>{ 
    var email = req.body.email
    var password = req.body.password

    User.findOne({where : {email : email}}).then((result)=>{ 
        if(result){
            bcrypt.compare(password, result.password, (err, result1)=>{
                if(result1 == true){
                    req.session.Id = result.id
                    res.json({status : true, message:'Login successfully!!'})
                }else{
                    res.json({status : false, message:'Invalid Details Please Fill Correct Info.'})
                }
            });
        }else{
            res.json({message:'Email not exists, Please Fill Correct Info.'})
        }
    }).catch((err)=>{
        res.json({status : false, error : err,message:'Email not exists, Please Fill Correct Info.'});
    });
}

module.exports.getForgotPassword=(req, res)=>{
    res.render('forgot-password');
}

module.exports.postForgotPassword=(req, res)=>{
    var email =  req.body.email
    var newPassword = req.body.newPassword
    var subject = 'Request for forgot-password'
    var mailData = {
        template : 'Your new password for InboxGun is : <b>'+newPassword+'<b>'
    }
    User.findOne({where :{email : email}}).then((result)=>{
        if(result){
            bcrypt.hash(newPassword, 8, async(err, hash)=>{
                let m =  await sendMail(details, mailData, subject, email);
                if(m.messageId){
                    User.update({password:hash, resetPasswordToken:hash},{where:{email: result.email}}).then((updateData)=>{
                        res.json({status : true, message : 'Please check your mail inbox!'})
                    }).catch((err)=>{
                        res.json({status : false, message:'Password not updated', error : err})
                    });
                }else{
                    res.json({status : false, message : 'We are not able to send email now, please try after sometime!'})
                }

            });
        }else{
            res.json({status : false, message:'Email not exists!!'})
        }
    }).catch((err)=>{
        res.json({status : false, message:'Email not exists!!', error : err})
    });
}