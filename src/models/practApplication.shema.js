const mongoose = require('mongoose');

const applicationSchema =new mongoose.Schema({
  practitioner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Practitioner",
    required:true
  },
  email:{
    type:String,
    
  },
  department:{
      type:mongoose.Schema.Types.ObjectId,
  ref:"Department"
      
  },
  status:{
    type:String,
    enum:["approved" , "pending" , "rejected"],
    default:"pending"
  }
  ,
  applicationDate:{
    type:Date,
    default:Date.now
  },
  verifydate:{
    type:Date
  }
  ,
  remark:{
    type:String
  }
},{
  timeStamps:true
})

module.exports = mongoose.model("application", applicationSchema)