const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: "Practitioner", required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true },

  day: { type: String, required: true },      
  slotName: { type: String, required: true }, 

  type: { type: String, enum: ["therapy", "consultation"], required: true },
  status: { type: String, enum: ["booked", "completed", "cancelled"], default: "booked" },

}, { timestamps: true });

module.exports = mongoose.model("Appointment", AppointmentSchema);
