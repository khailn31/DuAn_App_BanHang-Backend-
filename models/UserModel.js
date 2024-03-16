const mongoose = require('mongoose');
const UserSchema =new mongoose.Schema({
    email : String,
    password : String,
    money:Number
},{collection:"Users"});
const User=mongoose.model("Users",UserSchema);
module.exports=User;