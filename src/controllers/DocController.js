const docSchema = require("../models/doc.schema");
const isEmailValid = require("../utils/emailValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const docRegister = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    specialization,
    phone,
    address,
    certifications,
    clinic,
    password,
    licNo
  } = req.body;

  if (
    !licNo||
    !firstName ||
    !lastName ||
    !email ||
    !specialization ||
    !phone ||
    !address ||
    !certifications ||
    !clinic ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  if (!isEmailValid(email)) {
    return res.status(400).json({
      message: "please enter a valid email address!",
    });
  }
// checking if email alrady registered
  const isAlreadyReg = await docSchema.findOne({email:email})

  if(isAlreadyReg){
    return res.status(400).json({message:"email already registered!"})
  }

  // if lic number already exist

  if(isAlreadyReg && isAlreadyReg.licNo == licNo){
    return res.status(400).json({message:"practitioner already registered with same lic num!"})
  }



  try {
    const newDoc = await docSchema.create({
      firstName,
      lastName,
      email,
      specialization,
      phone,
      address,
      certifications,
      clinic,
      password,
      licNo
    });
 

    return res.status(201).json({
      message:"registered successfully",
      user:newDoc
    })


  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to register , internal server error!",
    });
  }
};

const docLogin = async (req, res) => {
  const { docId, password } = req.body;

  if (!docId || !password) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const docDetails = await docSchema.findOne({ docId });

    if (!docDetails) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const isVerified = await bcrypt.compare(password, docDetails.password);
  
    if (!isVerified) {
      return res.status(401).json({
        message: "invalid credentials",
      });
    }

    const token = jwt.sign({ docId }, process.env._SECRET, {
      expiresIn: "12h",
    });

    res.cookie("panchakarma", token, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 12 * 60 * 60,
      secure: true,
    });

    res.status(200).json({
      message: "logged in successfully!",
      user: docDetails,
    });
  } catch (error) {}
};








module.exports = { docRegister, docLogin };
