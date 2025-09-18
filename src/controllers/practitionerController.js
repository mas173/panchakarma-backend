const practApplicationShema = require("../models/practApplication.shema");
const practitionerSchema = require("../models/practitioner.schema");
const isEmailValid = require("../utils/emailValidator");
const verifyOtp = require("../utils/otpVerify");
const { randomOtp } = require("../utils/randomOtp");
const sendOtpEmail = require("../utils/sendEmailotp");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const practationerRegister = async (req, res) => {
  const { email, password, firstName, lastName, otp } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const isEmail = isEmailValid(email);

  if (!isEmail) {
    return res.status(400).json({
      message: "please enter valid email address!",
    });
  }

  try {
    const practitioner = await practitionerSchema.findOne({ email: email });

    if (practitioner && practitioner.isEmailVerified) {
      return res.status(400).json({
        message: "email already registered! please login",
      });
    }
    const hashedPassword =await bcrypt.hash(password , 10)
    const newPractitioner = await practitionerSchema.findOneAndUpdate(
      { email },
      { $set: { firstName, lastName, password:hashedPassword } },
      {
        upsert: true,
        new: true,
      }
    );

    const Otp = randomOtp(4);

    const isOtpSent = sendOtpEmail(email, Otp);

    if (!isOtpSent) {
      return res.status(500).json({
        message: "failed to send otp ! try again",
      });
    }

    return res.status(201).json({
      message: "user data added , verify otp!",
      user: newPractitioner,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "failed to register!",
    });
  }
};
const practationerEmailVerfication = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  try {
    const isEmailVerified = await verifyOtp(email, otp);

    if (!isEmailVerified) {
      return res.status(400).json({
        message: "invalid otp!",
      });
    }

    await practitionerSchema.findOneAndUpdate(
      { email },
      {
        $set: {
          isEmailVerified: true,
        },
      }
    );

    return res.status(200).json({
      message: "email verified !",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to verify otp!",
    });
  }
};

const practitionerLogin = async (req,res)=>{
 
  const {email , password}= req.body
  if(!email || !password){
    return res.status(400).json({
      message:"All fields are required!"
    })
  }

  try {
    const practitioner = await practitionerSchema.findOne({email:email})

    if(!practitioner){
      return res.status(400).json({
        message:"Invalid email or password"
      })
    }

 const isPassoword =  await bcrypt.compare(password , practitioner.password)

 if(!isPassoword){
  return res.status(401).json({
    message:"Invalid email or password"
  })
 }

 const token = jwt.sign({
  id:practitioner._id , email:practitioner.email
 },process.env._SECRET,{expiresIn:"1d"})

   res.cookie("panchakarma", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

   return res.status(200).json({
    message:"login success"
   })
 

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message:"failed to login!"
    })
    
  }

}

const practitionerOnboard = async (req, res) => {
  const id = req.user._id

  const {
    mobNum,
    gender,
    dob,
    nationality,
    govtId,
    profilePic,
    highestQualification,
    university,
    yearOfPassing,
    rollNumber,
    internshipCertificate,
    degreeCertificate,
    regNo,
    stateCouncil,
    regDate,
    regCertificate,
    specialization,
    therapiesOffered,
    consultationFee,
    followUpFee,
    clinic,
    selfDeclaration,
    consent,
  } = req.body;

  try {
 
     const userdata = await practitionerSchema.findById(id)

     if(userdata.isOnboarded){
      return res.status(400).json({
        message:"practitioner already onboarded!"
      })

     }


    const newPractitioner = await practitionerSchema.findByIdAndUpdate(
      id,
      {
        mobNum,
        gender,
        dob,
        nationality,
        govtId,
        profilePic,
        highestQualification,
        university,
        yearOfPassing,
        rollNumber,
        internshipCertificate,
        degreeCertificate,
        regNo,
        stateCouncil,
        regDate,
        regCertificate,
        specialization,
        therapiesOffered,
        consultationFee,
        followUpFee,
        clinic,
        selfDeclaration,
        consent,
        isOnboarded:true
      },
      { upsert: true, new: true, runValidators: true }
    );

    await practApplicationShema.create({
      email:userdata.email , practitioner:newPractitioner._id,
    })

    return res.status(201).json({
      message: "Practitioner request created!",
      practitioner: newPractitioner,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to create application",
      error: error.message,
    });
  }
};

const practitionerAuth = async (req,res)=>{
 const id = req.user.id

 if(!id){
 return res.status(401).json({
  message:"id is required!"
 })

 }

 try {
  
 const user = await practitionerSchema.findById(id).select("firstName lastName clinic profilepic weeklySchedule ")

 if(!user){
  return res.status(400).json({
    message:"practitioner not found!"
  })
 }


 return res.status(200).json({
  role:"practitioner",
  practitioner:{
    firstName:user.firstName,
    lastName:user.lastName,
    id:user._id
  }

 })

 } catch (error) {
  console.log(error)
  return res.status(500).json({message:"failed to validate"})
 }

}

const practitionerLogout = async (req, res) => {
  res.clearCookie("panchakarma", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};




module.exports = { practitionerOnboard, practationerRegister ,practationerEmailVerfication ,practitionerLogin ,practitionerAuth,practitionerLogout};
