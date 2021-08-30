const express = require('express')
const con = require('../config')

exports.getUserDetails = async(req, res) => {  
    if(!req.session.user){
        req.flash('error', 'Session expired. Login again!')
        return res.render('./login',{title:"Admin - Login"}) 
    }
    
    // fetch all users except the logged one
    con.query("SELECT * FROM user WHERE delete_status = 0 AND user_id != ?  order by user_id ASC", [req.session.user.user_id], (err, results) => { 
 
        if(err) { 
            console.log('Error2:',err)
        } else {   
            res.render('./user/list',{title:"User - List" , userData:JSON.parse(JSON.stringify(results))})
        }
    })
} 

exports.updateUserDetails = async(req,res) =>{ 
    let user = req.body  
    con.query("Update user set  ?  WHERE user_id = ? ", [user,user.user_id], (err, result) => { 
        if(err) { 
            throw err
        }else{ 
            req.flash('success','User Details Updated') 
            res.redirect('./list')
        }
    })
}

exports.addUser = async (req,res) =>{
    let user = req.body  
    con.query("INSERT INTO `user` set ?", [user], (err, result) => { 
        if(err) { 
            throw err
        }else{ 
            req.flash('success','User Details Added') 
            res.redirect('./list')
        }
    })
}


// Still to be completed
exports.getDeletedUsers = async(req, res) => {   
    // fetch all users except the logged one
    con.query("SELECT * FROM user WHERE delete_status = 1 ORDER BY user_id ASC", [req.session.user.user_id], (err, results) => { 
        if(err) { 
            console.log('Error2:',err)
        } else {   
            res.render('./user/deletedList',{title:"User - Deleted List" , userData:JSON.parse(JSON.stringify(results))})
        }
    })
} 
