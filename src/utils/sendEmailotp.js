const emailOtp = require("../emails/emailOtp");
const otpSchema = require("../models/email.schema");

const sendOtpEmail = async (email, otp) => {
  if (!email || !otp) {
    console.log("please provide email and otp");
    return false; 
  }



  try {
    const subject = "practitioner email verification!"

  await emailOtp(email, otp , subject )


    await otpSchema.findOneAndUpdate({
      email
  
    },{
      $set:{otp:otp}
    },{
      upsert:true, new:true
    });

    return true;
  } catch (error) {
    console.error("Error saving OTP:", error);
    return false;
  }
};

module.exports = sendOtpEmail;
