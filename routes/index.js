const express = require('express') 
var app = express()

var session = require('express-session')

var authController = require('../controllers/auth');
require('../config')
  
app.get('/',(req,res)=> {  
    if(req.session.user){
        delete req.session.user;
        console.log('session out');
    }
    res.render('./login', { title: 'Admin- Login'})
});

app.get('/login',(req,res)=> { 
    if(req.session.user){
        delete req.session.user;
        console.log('session out');
    }
    res.render('./login', { title: 'Admin- Login'})
});

app.get('/register',(req,res)=> { 
    res.render('./register', { title: 'Admin- Register'})
});

app.get('/dashboard',(req,res)=> {  
    if(!req.session.user){
        console.log('session out'); 
        req.flash('error','Unauthorized Login')
        res.redirect('./login')
    } else {   
        // console.log('SESS USER : ',req.session.user.user_id)
        res.render('./dashboard', { title: 'Admin- Dashboard'})
    } 
});

app.get('/forgot-password',(req,res)=> { 
    res.render('./forgot-password', { title: 'Admin- Forgot Password'})
});
 
app.get('/reset-password/:email', (req,res) => {  
    res.render('./reset-password', { title: 'Admin- Reset Password' , email:req.params.email})
});

app.get('/logout',(req,res)=>{  
    delete req.session.user;
    res.redirect('./login')
});

function checkSignIn(req, res) {
    if(req.session.user){
        console.log('You have logged in!') 
        //   next();     //If session exists, proceed to page
        return true;
    } else {
       var err = new Error("Not logged in!");
    //    console.log('Not logged in! SESS:',req.session.user);
       return false;
        //    next(err);  //Error, trying to access unauthorized page!
    }
 }
 
app.post('/validateLogin',authController.login); 
app.post('/validate-email',authController.sendemail);
app.post('/update-password',authController.updatePassword);
 

module.exports = app
 