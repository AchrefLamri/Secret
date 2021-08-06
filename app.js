const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require("mongoose-encryption");
const User = require('./model/user');


// set up the app 
const app = express();

// set body parser
app.use(express.urlencoded({extended:true}));

// register view enging
app.set('view engine','ejs');

// set up the static file
app.use(express.static('public'));

// connect to DataBase
const uri = 'mongodb://localhost:27017/UserDB';

mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>console.log('connect to Db :)'))
.catch((err)=>console.log(err))

// Home Route
app.get('/',(req,res)=>{
    res.render('home')
});
// login Route
app.get('/login',(req,res)=>{
    res.render('login')
});
// register Route
app.get('/register',(req,res)=>{
    res.render('register')
});

// register New user
app.post('/register',(req,res)=>{
    let username = req.body.username,
        password = req.body.password,
        newUser = new User({email:username,password:password});
    
    newUser.save()
    .then(()=>{       
        console.log('don :)')
        res.render('secrets')
    })
    .catch((err)=>console.log(err))
})

// Login to your account 
app.post('/login',(req,res)=>{
    let username = req.body.username,
        password = req.body.password;

    User.findOne({email:username})
    .then(foundUser =>{
        if(foundUser){
            if(foundUser.password === password){
                res.render('secrets')
            }else{
                res.send('password is not correct try agin :(')
            }
        }else{
            res.send("Not Found :( plase register this user .")
        }
    })
    .catch(err =>console.log(err))
        
})


// listen for requestes
app.listen(3000,()=>{
    console.log('sever start on port 3000')
})