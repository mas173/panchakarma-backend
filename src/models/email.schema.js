const mongoose = require('mongoose');


const emailOtp = new mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,  
  },
  otp:{
    type:String, 
    required:true 
  }
})


module.exports = mongoose.model("emailOtp",emailOtp)

