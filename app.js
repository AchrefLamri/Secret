require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
// 
const  LocalStrategy = require("passport-local")
const session = require('express-session');
const passport = require ('passport');
const passportLocalMongoose = require("passport-local-mongoose");

// // md5 Hash method 
// const md5 = require('md5');
// // bcrypt Hash method
// const bcrypt = require('bcrypt');
// const saltRounds = 10;//how much Hash  

const User = require('./model/user');


// set up the app 
const app = express();

// set body parser
app.use(express.urlencoded({extended:true}));

// register view enging
app.set('view engine','ejs');

// set up the static file
app.use(express.static('public'));

// set up the session configutation
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
  }));

// set up passport 
app.use(passport.initialize());//initialize passport
app.use(passport.session());// use passport to mange our session

// Simplified Passport/Passport-Local Configuration

// passport loca mongo to create a local login strategi 
passport.use(User.createStrategy()); 
// set passport to serialize and deserialize User 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead
mongoose.set('useCreateIndex', true);
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

// logout Route
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
});

// register Route
app.get('/register',(req,res)=>{
    res.render('register')
});
// secrets
app.get('/secrets',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('secrets')
    }else{
        console.log(req.isAuthenticated())
        res.redirect('/login')
    }
});

// register New user
app.post('/register',(req,res)=>{

    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{

        if(err){
            console.log(err);
            res.redirect('/register');
        }else{

            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });          
        }
    })

});


// Login to your account 
app.post('/login',(req,res)=>{

    let user  = new User ({
        username : req.body.username,
        password : req.body.password
    })  
    req.logIn(user,(err)=>{
        if(err){
            console.log(err)
        }else{
            passport.authenticate('local')(req,res,()=>{
                res.redirect('/secrets')
            })
        }
    })


    // .then(foundUser =>{

    //     if(foundUser){
    //         // bcrypt.compare(passwordtext, bcrypt.hash)
    //         bcrypt.compare(password, foundUser.password)
    //         .then((result)=> {
    //             // result true or False 
    //             if(result){
    //                 res.render('secrets')
    //             }else{
    //                 res.send('password is not correct try agin :(')
    //             }
    //         });
        
    //     }else{
    //         res.send("Not Found :( plase register this user .")
    //     }
    // })
    // .catch(err =>console.log(err))
        
})


// listen for requestes
app.listen(3000,()=>{
    console.log('sever start on port 3000')
})