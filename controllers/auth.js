const con = require('../config')
const CryptoJS = require('crypto-js')
var jwt = require('jsonwebtoken');
require('express-flash') 
//send email
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({})

exports.login = async(req, res) => {
    try{
        const {ofc_email,password} = req.body
        if(!ofc_email || !password) {
            req.flash('error', 'Email or Password is incorrect!')
            return res.render('./login',{title:"Admin - Login"}) 
        } 
        
        con.query("SELECT * FROM user WHERE ofc_email = ?",[ofc_email], (err, results, fields) => {
            if (err) throw err; 

            console.log(CryptoJS.MD5(password).toString())

            if(results.length == 0 || (results[0].password != CryptoJS.MD5(password).toString())){ 
                req.flash('error', 'Email or Password is incorrect!') 
                res.render('./login',{title:"Admin - Login"}); 
            }else{
                    //success 
                    let id = results[0].user_id;    
                    //Set login session 
                    req.session.user = {'name':results[0].name,'user_id':id, 'ofc_email' : results[0].ofc_email}
                    
                    const token = jwt.sign({ id }, process.env.JWT_SECRET,{
                        expiresIn : process.env.JWT_EXPIRES_IN
                    })
                    // console.log('The Token is :',token)
                    const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 
                    ) 
                } 
                res.redirect('./dashboard'); 
            }
        }); 
    }catch(error){
        console.log('Auth:',error)
    } 
}

exports.sendemail = async(req, res) => { 
    req.assert('ofc_email', 'ofc_email is required').notEmpty()  //Validate password 
    const {ofc_email} = req.body
    var errors = req.validationErrors() 
    if(!errors){ 
        con.query("SELECT * FROM user WHERE ofc_email = ?",[ofc_email], (err, results, fields) => { 
            if(results.length == 0 ){ 
                req.flash('error','Email id Not Registerd!')
                return res.render('./forgot-password',{title:"Admin - Forgot Password"}) 
            }else{
                var form_data = {  
                    'ofc_email': ofc_email   
                };
              
                let transport = nodemailer.createTransport({
                    host: 'smtp.mailtrap.io',
                    // host: 'localhost',
                    port: 587,
                    auth: {
                        user: process.env.SMTP_USERNAME,
                        pass: process.env.SMTP_PASSWORD
                    }
                });

                const message = {
                    from: 'tech.db@dollarbirdinc.com', // Sender address
                    to: ofc_email,         // List of recipients
                    subject: 'Reset your password', // Subject line
                    text: 'Password reset link has been sent to registered email id ' // Plain text body
                };

                transport.sendMail(message, function(err, info) {
                    if(err){
                        console.log('Mailer Error:',err)
                        req.flash('error','Sorry , Could not send Email!')
                        return res.render('./forgot-password',{title:"Admin - Forgot Password"}) 
                    }else{
                        console.log('Mail info -',info);
                        req.flash('success','Check your email for Password reset link!')
                        return res.render('./forgot-password',{title:"Admin - Forgot Password"}) 
                    }
                });
            }
        }) 
    }else{  
        req.flash('error','Email id Required!')
        return res.render('./forgot-password',{title:" Admin - Forgot Password"})  
    }
} 

exports.updatePassword = async(req, res) => { 
    const {ofc_email,password,confirm_password} = req.body;
 
    var new_password = CryptoJS.MD5(confirm_password);
   
    if(password != confirm_password){ 
        req.flash('error','Passwords mismatched!')
        return res.render('./reset-password',{title:"  Admin - Reset Password"}) 
    }else{ 
        con.query("UPDATE user SET password = ? WHERE ofc_email = ? ",[new_password.toString() , ofc_email], (err, results)=> { 
            if(err){ 
                throw err;
                // req.flash('error','Password Not Updated !')
                // res.render('./forgot-password',{title:" Admin -Forgot Password"}) 
            } else { 
                // console.log(results.affectedRows + " record(s) updated"); 

                req.flash('success','Password Updated ! Login here.')
                res.render('./login',{title:"  Admin -Login"})
            } 
        }); 
    }
}

 
// var md5Hash = CryptoJS.MD5("vinutha");
// console.log('MD5:',md5Hash.toString());

// var sha256Hash = CryptoJS.SHA256("Admin123"); 
// console.log('SHA256:',sha256Hash.toString());
