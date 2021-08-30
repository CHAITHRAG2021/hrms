const express = require('express');
const app = express();


const dotenv = require('dotenv');
dotenv.config({path:'./.env'})


var session = require('express-session')
var flash = require('express-flash')
app.use(flash())

var cookieParser = require('cookie-parser');
 
app.use(cookieParser()); 3
    app.use(session({ //{ cookie: { maxAge: 90060000 }, 
        secret: 'DBTech',
        resave: true, 
        saveUninitialized: true}));

// var sess = {
//     secret: 'keyboard cat',
//     cookie: {}
//   }
   
//   if (process.env.ENVIRONMENT  === 'production') {
//     app.set('trust proxy', 1) // trust first proxy
//     sess.cookie.secure = true // serve secure cookies
//   }
   
//   app.use(session(sess))
   
var config = require('./config');


//base path for including css n js in ejs file 
app.use('/public',express.static(__dirname + '/public'));
  
//set template engine
app.set('view engine','ejs'); 
 

//For getting form values on submit
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

// validation
var expressValidator = require('express-validator')
app.use(expressValidator());

var index = require('./routes/index');
app.use('/', index)

var admin = require('./routes/admin');
app.use('/admin', admin)

var user = require('./routes/user');
app.use('/user', user)

app.listen('3000', () => {
    console.log('Listening to Port 3000');
});