const express = require('express')
var app = express() 
var userController = require('../controllers/user');
const con = require('../config')
   
app.get('/',userController.getUserDetails); 
app.get('/add',(req,res) =>{
    res.render('./user/add',{title:"User - Add"})
}); 
app.get('/list',userController.getUserDetails); 
app.get('/edit/:id',(req,res) => {
      
    con.query("SELECT * FROM user WHERE user_id = ? ", [req.params.id], (err, results) => { 
        console.log(JSON.parse(JSON.stringify(results)))
        if(err) { 
            console.log('Error2:',err)
        } else {   
            res.render('./user/edit',{title:"User - Edit" , userData:results[0]})
        }
    })
}); 
app.post('/updateUserDetails',userController.updateUserDetails); 
app.post('/addUserDetails',userController.addUser); 
app.get('/delete/:id',(req,res) => {
 
    con.query("UPDATE `user` SET delete_status = 1 WHERE `user_id` = ?",[req.params.id], (err,result) => {
        if(err) throw err
        if(result.affectedRows == 1){
            req.flash('success','User data deleted !');
            res.redirect('/user/list')
        }
    })
}); 

app.get('/deletedUsers',userController.getDeletedUsers);






module.exports = app
 