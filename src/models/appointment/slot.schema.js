const mongoose = require("mongoose");

const SlotSchema = new mongoose.Schema({
  name: { type: String },  
  start: { type: String, required: true },  
  end: { type: String, required: true },    
  type: { type: String, enum: ["therapy", "consultation", "break"], required: true },


  status: { type: String, enum: ["free", "booked"], default: "free" },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null }
});

module.exports = SlotSchema;