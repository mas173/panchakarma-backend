const emailOtp = require("../emails/emailOtp");
const otpSchema = require("../models/email.schema");

const sendOtp = async (email,subject) => {
  // generating random 4 digit numbers

  const otp = Math.floor(1000 + Math.random() * 9000);

  try {
  

    // sending otp to the email
    await emailOtp(email, otp, subject);
    
    

   await otpSchema.findOneAndUpdate(
      { email },                       
      { otp: otp.toString() },           
      { upsert: true, new: true }         
    );

    return true;
  } catch (error) {
    console.log("failed to send otp", error);
    return false
  }
};

module.exports = { sendOtp };
