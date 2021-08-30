//DB conncetion
var mysql = require('mysql') 
  
const con = mysql.createConnection({  
    host: process.env.DATABASE_HOST,  
    user: process.env.DATABASE_USER,  
    password: process.env.DATABASE_PASSWORD,  
    database: process.env.DATABASE  
});  

con.connect((err)=>{
    if(err){
        console.log('DB Error , ensure you started XAMPP '+err);
    }else{
        console.log('DB connected');
    }
})

module.exports = con