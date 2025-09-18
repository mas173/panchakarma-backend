const mongoose = require('mongoose');

const consultSchema =new mongoose.Schema({
  patient:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Patient"
  },
    practitioner:{
    type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Practitioner"
    
  },
  dignosis:{
      type: mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"Dosha"
  },
  time:{
  type:"string",
  required:true
  }

}
,{timestamps:true})


module.exports = mongoose.model("Consult",consultSchema)