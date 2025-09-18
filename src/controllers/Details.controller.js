const patientSchema = require("../models/patient.schema")
const symptomsSchema = require("../models/symptoms.schema")


const getPatientDetails = async (req,res)=>{
const id = req.user._id
  const  patient = await patientSchema.findById(id).populate("symptoms").select("-password")

  if(!patient){
    return res.status(400).json({
      message:"patient not found"
    })
  }

  return res.status(200).json({
    patient
  })


}

module.exports = {getPatientDetails}