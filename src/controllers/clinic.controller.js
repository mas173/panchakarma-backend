const clinicSchema = require("../models/clinic.schema");
const docSchema = require("../models/doc.schema");

const isEmailValid = require("../utils/emailValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyOtp = require("../utils/otpVerify");
const randomString = require("../utils/randomString");
const clinicpassReset = require("../emails/clinicPassReset");
const { randomOtp } = require("../utils/randomOtp");
const emailOtp = require("../emails/emailOtp");
const emailSchema = require("../models/email.schema");

const clinicLogin = async (req, res) => {
  const { credential, password } = req.body;

  const isEmail = isEmailValid(credential);

  let Clinic;

  try {
    if (isEmail) {
      Clinic = await clinicSchema.findOne({ email: credential });
    } else {
      Clinic = await clinicSchema.findOne({ branchCode: credential });
    }

    if (!Clinic) {
      return res.status(400).json({
        message: "invalid credentials!",
      });
    }

    const isPassValid = await bcrypt.compare(password.trim(), Clinic.password);

    if (!isPassValid) {
      return res.status(401).json({
        message: "invalid credentail",
      });
    }

    const token = jwt.sign(
      { id: Clinic._id, branchCode: Clinic.branchCode, role: "clinic" },
      process.env._SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("panchakarma", token, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60*1000,
      secure: true,
    });

    return res.status(200).json({
      message: "logged in as clinic",
      clinic: {
        name: Clinic.clinicName,
        code: Clinic.branchCode,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to login",
    });
  }
};

const  changePass = async(req,res) =>{
  const id = req.user.id
 
  const {oldPass , newPass} = req.body

  if(!oldPass || !newPass){

    return res.status(400).json({
      message:"All fields are required!"
    })
  }

  

  try {
    
  const clinic = await clinicSchema.findById(id)

  if(!clinic){
    return res.status(400).json({
      message:"clinic not found!"
    })
  }

  const isPassValid = await bcrypt.compare(oldPass,clinic.password)

  if(!isPassValid){

    return res.status(401).json({
      message:"invalid password"
    })
  }

  if(oldPass == newPass){
    return res.status(400).json({
      message:"new passoword must be different"
    })
  }

  if(newPass.length <6){
    return res.status(400).json({
      message:"password must be greater than 6 character"
    })
  }


clinic.password = newPass
 if(!clinic.onBoarded){
  clinic.onBoarded = true
 }
await clinic.save()

return res.status(200).json({
  message:"password updated sucessfully"
})



  } catch (error) {
    
    console.log(error)
    
    return res.status(500).json({
      message:"failed to update password , try again later"
    })
  }
 




}

const clinicResetpass = async (req,res)=>{

  const {email, otp} = req.body
    
  if(!email){
    return res.status(401).json({
      message:"id is required"
    })
  }

  

  if(!otp){
    return res.status(401).json({
      message:"otp is required"
    })
  }

  try {
    
 const clinic = await clinicSchema.findOne({email:email})
 if(!clinic){

  return res.status(401).json({
    message:"no clinic registered with the email"
  })


 }

 const isOtpverified = await verifyOtp(clinic.email , otp)

 if(!isOtpverified){
  return res.status(401).json({
    message:"invalid otp"
  })
 }
 const randomPass = randomString(8)

 clinic.isDefaultPass = false
 clinic.password = randomPass
 
 await clinic.save()

 await clinicpassReset(clinic.email ,clinic.clinicName , randomPass )


 return res.status(200).json({
  message:"your password has been reset , check your email !"
 })
 




  } catch (error) {

    console.log(error)
    return res.status(500).json({
      message:"failed to reset password!"
    })
    
  }


}

const sendResetOtp = async(req,res)=>{
 const {email} = req.body

 if(!email){
  return res.status(401).json({
    message:"email is required"
  })
 }


 try {
  
 const clinic  = await clinicSchema.findOne({email:email})

 if(!clinic){
  return res.status(401).json({
    message:"email not found"
  })
 }

 const subject = "panchakarma - otp for password reset"

 const otp = randomOtp(4)
 

 await emailSchema.findOneAndUpdate({email},{
  $set:{
    email:email,
    otp:otp
  }
 },{
    new:true , upsert:true
  })
 
  
  await emailOtp(email , otp , subject)
  clinic.isDefaultPass = true
 await clinic.save()
 



return res.status(200).json({
  message:"otp sent!"
})

 } catch (error) {
  console.log(error)
  return res.status(500).json({message:"failed to send otp !"})
  
 }


}




module.exports= {clinicLogin , changePass ,clinicResetpass ,sendResetOtp}