//  patient controller

// dependencies
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const doshaSchema = require("../models/symptoms.schema");

// utility functions
const isEmailValid = require("../utils/emailValidator");
const patientSchema = require("../models/patient.schema");
const otpSchema = require("../models/email.schema");
const { sendOtp } = require("./email.controller");
const verifyOtp = require("../utils/otpVerify");
const regEmail = require("../emails/regEmail");
const { upsertStreamUser } = require("../lib/stream");

const patientLogin = async (req, res) => {
  const { password, credential } = req.body;

  if (!credential || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  let loginType = "email";

  if (!isEmailValid(credential)) {
    loginType = "patientId";
  }

  let patient;

  try {
    if (loginType == "email") {
      patient = await patientSchema.findOne({ email: credential });
    } else {
      patient = await patientSchema.findOne({ patientId: credential });
    }

    if (!patient) {
      return res.status(401).json({
        message: `invalid ${loginType} or password`,
      });
    }

    const isPassMatch = await bcrypt.compare(password, patient.password);

    if (!isPassMatch) {
      return res.status(401).json({
        message: `invalid ${loginType} or password`,
      });
    }

    const token = jwt.sign(
      { id: patient.patientId, dbId: patient._id, email: patient.email },
      process.env._SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("panchakarma", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });

    res.status(200).json({
      message: "logged in successfully",
      user: {
        patientId: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to login",
    });
  }
};

const patientRegister = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    res.status(400).json({ message: "All fields are required" });
    return;
  }

  if (!isEmailValid(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  if (password.length < 6) {
    res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
    return;
  }

  try {
    const existingPatient = await patientSchema.find({ email: email });
    if (existingPatient.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }
    //sending otp and saving to the db

    await sendOtp(email);

    // hashing the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newPatient = await patientSchema.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Patient registered successfully",
      patient: newPatient,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const patientOtpVerify = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const isverified = await verifyOtp(email, otp);

    if (isverified) {
      const user = await patientSchema.findOne({ email: email });

      if (!user) {
        return res
          .status(400)
          .json({ message: "user not found , please register" });
      }
      user.isverified = true;

      await user.save();

      return res.status(200).json({
        message: "email verified",
      });
    } else {
      return res.status(401).json({
        message: "invalid otp",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to verify otp",
    });
  }
};

const patientObnboarding = async (req, res) => {
  const patientId = req.user.patientId;
  const imageUrl = req.imgData?.imageUrl;
  const {
    age,
    address,
    emergencyContact,
    bloodGroup,
    height,
    weight,
    allergies,
    gender,
    dob,
    contactNumber,
  } = req.body;

  if (
    !age ||
    !address ||
    !emergencyContact ||
    !bloodGroup ||
    !height ||
    !weight ||
    !allergies ||
    !gender ||
    !dob ||
    !contactNumber
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const patient = await patientSchema.findOne({ patientId: patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.isverified) {
      return res.status(401).json({ message: "Email not verified" });
    }
    if (patient.isOnboarded) {
      return res.status(400).json({ message: "Patient already onboarded" });
    }

    patient.age = age;
    patient.address = address;
    patient.emergencyContact = emergencyContact;
    patient.bloodGroup = bloodGroup;
    patient.height = height;
    patient.weight = weight;
    patient.allergies = allergies;
    patient.gender = gender;
    patient.dob = dob;
    patient.contactNumber = contactNumber;
    patient.isOnboarded = true;
    patient.profileUrl =
      imageUrl ||
      "https://res.cloudinary.com/dj7jdqra0/image/upload/v1756834333/user_d74kqt.png";

    await patient.save();
      try {
      await upsertStreamUser({
        id: patient._id,
        name: patient.firstName+ " " +patient.lastName,
        image: patient.profileUrl
      });

      console.log("stream user created for: ", newUser.fullName);
    } catch (error) {
      console.log(error);
    }


    return res.status(200).json({
      message: "Patient details updated successfully",
      patient: patient,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Failed to update patient details" });
  }
};

const patientLogout = async (req, res) => {
  res.clearCookie("panchakarma", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

const forgetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  // check if email is valid
  try {
    const patient = await patientSchema.findOne({ email: email });

    if (!patient) {
      return res.status(404).json({ message: "email not found" });
    }
    const subject = "Your OTP Code for Password Reset";

    const status = await sendOtp(email, subject);

    if (status) {
      return res.status(200).json({ message: "otp sent successfully" });
    } else {
      return res.status(500).json({ message: "failed to send otp" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "failed to send otp" });
  }
};

const patientChangePassword = async (req, res) => {
  const patientId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (oldPassword === newPassword) {
    return res
      .status(400)
      .json({ message: "New password must be different from old password" });
  }

  try {
    const patient = await patientSchema.findOne({ patientId: patientId });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, patient.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    patient.password = hashedPassword;
    await patient.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "failed to change password" });

    return;
  }
};

const resetpass = async (req, res) => {
  const { otp, newPassword } = req.body;

  if (!otp || !newPassword) {
    return res.status(400).json({
      message: "all fields are required",
    });
  }

  try {
    const otpdata = await otpSchema.findOne({ otp: otp });
    if (!otpdata) {
      return res.status(401).json({
        message: "invalid otp",
      });
    }

    const newHashedpass = await bcrypt.hash(newPassword, 10);
    const patient = await patientSchema.findOne({ email: otpdata.email });

    patient.password = newHashedpass;
    await patient.save();

    await otpSchema.deleteMany({ email: otpdata.email });

    return res.status(200).json({
      message: "password reset successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to reset password",
    });
  }
};

const confirmReg = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const patient = await patientSchema.findOne({ email: email });

    if (!patient) {
      return res.status(404).json({ message: "patient not found" });
    }
    if (patient.isverified) {
      return res.status(400).json({ message: "email already verified" });
    }

    const isVerified = await verifyOtp(email, otp);

    if (!isVerified) {
      return res.status(401).json({ message: "invalid otp !" });
    }

    await patientSchema.updateOne(
      { email: email },
      { $set: { isverified: true } }
    );

    await regEmail(email, patient.firstName, patient.patientId);

    return res.status(200).json({ message: "email verified successfully" });
  } catch (error) {
    console.log("email verification failed", error);
    return res.status(500).json({ message: "failed to verify email" });
  }
};

const getSymptoms = async (req, res) => {
  const id = req.user._id;
  const {  dry_skin,
      dry_hair,
      gas_constipation,
      cold_hands_feet,
      light_sleep,
      anxiety_restlessness,
      mood_swings,
      heat_sensitivity,
      skin_rash,
      excess_hunger,
      anger_irritation,
      acidity_loose_motion,
      sensitive_eyes,
      prefer_cool_env,
      weight_gain,
      sinus_mucus,
      laziness_sleepiness,
      slow_digestion,
      oily_skin,
      difficulty_waking,
      sluggish_inactivity,} = req.body
  


try {
  
  const dosha = await doshaSchema.findOneAndUpdate(
    {patient:id},
    {patient:id,
      dry_skin,
      dry_hair,
      gas_constipation,
      cold_hands_feet,
      light_sleep,
      anxiety_restlessness,
      mood_swings,
      heat_sensitivity,
      skin_rash,
      excess_hunger,
      anger_irritation,
      acidity_loose_motion,
      sensitive_eyes,
      prefer_cool_env,
      weight_gain,
      sinus_mucus,
      laziness_sleepiness,
      slow_digestion,
      oily_skin,
      difficulty_waking,
      sluggish_inactivity,
    },
    { upsert: true, new: true }
  );

  await patientSchema.findByIdAndUpdate(id , {symptoms:dosha._id})

  return res.status(200).json({
    message:"symptoms updated successfully!",
    symptoms:dosha
  })
} catch (error) {
  console.log(error)
  return res.status(500).json({
    message:"failed to create!"
  })
  
}

  

};



module.exports = {
  patientLogin,
  patientRegister,
  patientLogout,
  patientChangePassword,
  forgetOtp,
  resetpass,
  patientObnboarding,
  confirmReg,
  patientOtpVerify,
  getSymptoms
};
