require('dotenv').config();
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const passportLocalMongoose = require ('passport-local-mongoose');

const Schema = mongoose.Schema;
const userSchema = new Schema({
          email:String,
          password:String
    });

// encryption the password in mongoose 
// userSchema.plugin(encrypt,{secret:process.env.SECRETE,encryptedFields:['password']});


// set up user schema to use passport local mongoose as a blugin
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User',userSchema);

module.exports = User;