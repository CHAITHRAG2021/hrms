const express = require('express')
var app = express() 
var adminController = require('../controllers/admin');
require('../config')
 
app.get('/profile',adminController.getUserDetails);
app.post('/updateProfile',adminController.updateProfile); 
app.post('/verify_password',adminController.verify_password); 
app.post('/updateUserPassword',adminController.updateUserPassword);
module.exports = app