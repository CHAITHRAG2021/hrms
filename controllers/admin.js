var express = require('express');
var session = require('express-session');
const con = require('../config')  

const CryptoJS = require('crypto-js')
// var jwt = require('jsonwebtoken');


exports.getUserDetails = async(req, res) => { 

    if(!req.session.user){
        req.flash('error', 'Session expired. Login again!')
        return res.render('./login',{title:"Admin - Login"}) 
    }
     
    con.query("SELECT * FROM `user` WHERE user_id = ? ", [req.session.user.user_id], (err, results) => { 
        if(err) { 
            console.log('Error2:',err)
        } else {  
            res.render('./admin/profile',{title:"Admin -settings" , userData:results[0]})
        }
    })
} 

exports.updateProfile = async(req, res) => {  
   
    let form_data = req.body;   

    con.query("UPDATE  `user` set ? WHERE user_id = ? ", [form_data,form_data.user_id], (err, result, fields) => { 
        if(err) { 
            console.log('Error2:',err)
        } else {  
            console.log('Updated!');
            req.flash('success','Profile Data updated');
            res.redirect('./profile')
        }
    })
}

exports.verify_password = async (req,res) => {
    let current_password = req.body.password
    let user_id = req.body.user_id
   
    console.log('passed:',req.body)
    con.query("SELECT password FROM  `user` WHERE user_id = ? ", [user_id], (err, result) => { 
        if(err) { 
            throw err
        }else{ 
            console.log('current_password:',current_password)
            if(result[0].password === CryptoJS.MD5(current_password).toString()){
                console.log('Matched!');  
                res.send(true) // returning response to ajax call
            }else{
                console.log('Not Matched!');
                res.send(false)
            }
        }
    })
}

exports.updateUserPassword = async(req,res) =>{
    let user = req.body 
    let password  = CryptoJS.MD5(user.password).toString()
    con.query("Update `user` set password = ?  WHERE user_id = ? ", [password,user.user_id], (err, result) => { 
        if(err) { 
            throw err
        }else{ 
            req.flash('success','Password Updated') 
            res.redirect('./profile')
        }
    })
} 