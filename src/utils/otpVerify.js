const otpSchema = require("../models/email.schema")

const verifyOtp = async(email, otp)=>{ 
  
 if(!email || !otp){
  console.log("All fields are required")
  return false 
 }

 try {
  
 const isotp =await otpSchema.findOne({email:email, otp:otp})
 if(!isotp){
  return false

 } 

 await otpSchema.deleteMany({email:email})
  return true

}catch (error) {
  console.log("failed to verify otp", error)
  return false
  
 }


}

module.exports = verifyOtp