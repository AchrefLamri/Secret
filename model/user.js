const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');


const Schema = mongoose.Schema;
const userSchema = new Schema({
          email:{
              type:String,
              required:true
          },
          password:{
            type:String,
            required:true
        }
    });

// encryption the password in mongoose 
let secret = 'Achraf is vergin'
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']});


const User = mongoose.model('User',userSchema);

module.exports = User;