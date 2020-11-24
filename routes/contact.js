var express = require('express');
var router = express.Router();

//controller require
const contactController = require('../controller/contacts');

router.get('/', contactController.getContacts);
router.post('/', contactController.postContacts);

router.post('/deleteContact', contactController.deleteContacts);

router.post('/groupCreate', contactController.groupCreate);
router.post('/deleteGroup', contactController.deleteGroup);
router.post('/groupUpdate', contactController.groupUpdate);
router.post('/updateContact', contactController.updateContact);

router.get('/viewPage', contactController.viewPage);

module.exports = router;