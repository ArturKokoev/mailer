//models require
const Contact = require('../models/contacts');
const Group = require('../models/group');
const Users = require('../models/users');

//get contacts.
module.exports.getContacts = (req, res)=>{
    if(req.session.Id){
        Users.findOne({where:{id:req.session.Id}}).then(users=>{
            Contact.findAll({where: {user_id:req.session.Id}, include: [{ model: Group, attributes: ['id','name']}]}).then(result=>{
                Group.findAll({where: {user_id:users.id}, include: [{ model: Contact, attributes: ['id']}]}).then(group=>{
                    res.render('contacts',{contacts:result, group:group});
                });
            }).catch(err=>{
                res.json({status : false,message:'Contacts not found.'})
            });
        });
    }else{
        res.redirect('/');
    }
}

//Save contacts details.
module.exports.postContacts = (req, res)=>{ 
    var group_id = req.body.group
    var name = req.body.name
    var email = req.body.email

    Contact.findOne({where:{email:email, user_id:req.session.Id}}).then(result=>{
        if(result){
            res.json({status:false,message:'Email already exists in this table...Try another.'})
        }else{
            if(group_id == ''){
                Contact.create({name:name, email:email, user_id:req.session.Id}).then(addData=>{
                    res.json({status:true, message:'Contact added.'})
                }).catch(err=>{
                    res.json({status:false, error:err, message:'Contact not added.'})
                });
            }else{
                Contact.create({name:name, email:email,group_id:group_id, user_id:req.session.Id}).then(addData=>{
                    res.json({status:true, message:'Contact added.',newContact:addData})
                }).catch(err=>{
                    res.json({status:false, error:err, message:'Contact not added.'})
                });
            }
        }
    }).catch(err1=>{
        res.json({status:false, error1:err1})
    });
}

//delete contact details.
module.exports.deleteContacts = (req, res)=>{
    Contact.destroy({where:{id : req.body.id}}).then(deleteData=>{
        res.json({status:true, message:'Contact deleted.'})
    }).catch(err=>{
        res.json({status:false, message:'contact not deleted.'})
    });
}

//group create.
module.exports.groupCreate = (req, res)=>{ 
    var group = req.body.group
    Group.findOne({where:{name:group, user_id:req.session.Id}}).then(findGroup=>{
        if(findGroup){
            res.json({status:false, message:'Group name already exists...Try another.'})
        }else{
            Group.create({name : group, user_id:req.session.Id}).then(groupData=>{
                res.json({status:true, message:'Group added successfully.', group:groupData})
            }).catch(err=>{
                res.json({status:false, message:'Group not added.'})
            });
        }
    }).catch(err=>{
        res.json({status:false, message:'Group not found.'})
    });
}

//delete group details.
module.exports.deleteGroup = (req, res)=>{
    Group.destroy({where:{id : req.body.id}}).then(deleteGrp=>{
        res.json({status:true, message:'Group deleted.'})
    }).catch(err=>{
        res.json({status:false, message:'Group not deleted.'})
    });
}

//update group details.
module.exports.groupUpdate = (req, res)=>{ 
    var group = req.body.group
    var id = req.body.id

    Group.findOne({where:{id:id}}).then(findGroup=>{
        if(findGroup){
            Group.update({name : group},{where:{id:id}}).then(groupData=>{
                res.json({status:true, message:'Group name updated.'})
            }).catch(err=>{
                res.json({status:false, message:'Group not updated.'})
            });
        }else{
            res.json({status:false, message:'Group name not exists...Try another.'})
        }
    }).catch(err1=>{
        res.json({status:false, message:'Group not found.'})
    });
}

module.exports.updateContact=(req, res)=>{
    var id= req.body.id
    var name= req.body.name
    var email= req.body.email
    var group= req.body.group

    if(group != ''){
        Contact.update({name:name,email:email,group_id:group},{where:{id:id}}).then(updtData=>{
            res.json({status : true, message :'Contact updated.'})
        }).catch(err=>{
            res.json({status : false, message :'Contact not updated.'})
        });
    }else{
        Contact.update({name:name,email:email},{where:{id:id}}).then(updtData=>{
            res.json({status : true, message :'Contact updated.'})
        }).catch(err=>{
            res.json({status : false, message :'Contact not updated.'})
        });
    }
}

module.exports.viewPage=(req, res)=>{
    Contact.findAll({attributes:['id','name','email','createdAt']},{where: {user_id:req.session.Id}}).then(result=>{
          let json = {
            "draw":1,
            "recordsTotal":result.length,
            "recordsFiltered":result.length,
            "data": result
          };
          res.send(json);
    }).catch(err=>{
        res.json({status : false})
    });
}
