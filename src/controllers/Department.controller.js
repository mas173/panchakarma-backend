const departmentSchema = require("../models/department.schema");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const clinicSchema = require("../models/clinic.schema");
const randomString = require("../utils/randomString");
const clinicAdded = require("../emails/clinicAdded");
const practApplicationShema = require("../models/practApplication.shema");
const scheduleSchema = require("../models/appointment/schedule.schema");
const generateWeeklySchedule = require("../utils/scheduleHelper");
const practitionerSchema = require("../models/practitioner.schema");
const dot = require("dotenv").config();

const departmentRegister = async (req, res) => {
  const { name, description, email } = req.body;

  if (!name || !description || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingDept = await departmentSchema.findOne({
      $or: [{ name: name }, { email: email }],
    });
    if (existingDept) {
      return res
        .status(409)
        .json({ message: "Department with same name or email already exists" });
    }

    const newDept = new departmentSchema({
      name,
      description,
      email,
    });

    await newDept.save();
    return res.status(201).json({
      message: "Department registered successfully",
      department: newDept,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const departmentLogin = async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const department = await departmentSchema.findOne({ userId: userId });
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    const isMatch = await bcrypt.compare(password, department.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jsonwebtoken.sign(
      { id: department._id, name: department.name, role: "department" },
      process.env._SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("panchakarma", token, {
      httpOnly: true,
      sameSite: "None",
      maxAge: 3600000,
      secure: true,
    });

    return res
      .status(200)
      .json({ message: "Login successful", department: department });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const departmentLogout = async (req, res) => {
  res.clearCookie("panchakarma");

  res.status(200).json({
    message: "logged out  successfully!",
  });
};

const addClinic = async (req, res) => {
  const id = req.user.id;
  const { clinicName, address, contact, email } = req.body;

  if (
    !clinicName ||
    !address?.street ||
    !address?.city ||
    !address?.state ||
    !address?.pincode ||
    !contact?.phone ||
    !contact?.email ||
    !email
  ) {
    return res.status(400).json({
      message: "All fields are required!",
    });
  }

  try {
    const isClinic = await clinicSchema.findOne({ email: email });
    if (isClinic) {
      return res
        .status(400)
        .json({ message: "clinic alredy registered with the same email" });
    }

    const randomPass = randomString(8);
    const clinic = new clinicSchema({
      clinicName,
      address,
      contact,
      password: randomPass,
      department: id,
      email,
    });

    await clinic.save();

    return res.status(201).json({
      message: " clinic added successfully",
      clinic: clinic,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to register department",
    });
  }
};

const verifyPractitioner = async (req, res) => {

  const id = req.user._id;

  const application_id = req.params.id;
  const {status , remark} = req.body
  try {
    const application = await practApplicationShema.findById(application_id);
  

    if (!application) {
      return res
        .status(400)
        .json({ message: "invalid request , no application found" });
    }

    const practitioner = await practitionerSchema.findById(application.practitioner)


    if (application.status != "pending") {
      return res.status(400).json({
        message: "Application already closed!",
      });
    }

    const schedule = await scheduleSchema.create({
       practitionerId: application.practitioner,
  weeklySchedule: generateWeeklySchedule()
    })

  application.status = status
  application.department = id
  application.remark = remark
  application.verifydate = Date.now()
  practitioner.weeklySchedule = schedule._id

  await application.save()
  await practitioner.save()
  return res.status(200).json({
   message:"status updated!",
   status:status
  })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      message:"failed to update status"
    })
  }
};

const getAllApplication = async(req,res)=>{

  const list =await practApplicationShema.find({status:"pending"}).populate("practitioner")

return res.status(200).json({
  pending:list
})




}

module.exports = {
  departmentRegister,
  departmentLogin,
  departmentLogout,
  addClinic,
  verifyPractitioner,
  getAllApplication
  
};
