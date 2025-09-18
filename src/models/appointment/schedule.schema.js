const SlotSchema = require("./slot.schema");
const mongoose = require('mongoose');



const ScheduleSchema = new mongoose.Schema({
  practitionerId: { type: mongoose.Schema.Types.ObjectId, ref: "Practitioner", required: true },

  weeklySchedule: {
    day1: { type: Map, of: SlotSchema }, // Monday
    day2: { type: Map, of: SlotSchema }, // Tuesday
    day3: { type: Map, of: SlotSchema }, // Wednesday
    day4: { type: Map, of: SlotSchema }, // Thursday
    day5: { type: Map, of: SlotSchema }, // Friday
    day6: { type: Map, of: SlotSchema }, // Saturday
    day7: { type: Map, of: SlotSchema }  // Sunday
  }

}, { timestamps: true });

module.exports = mongoose.model("Schedule", ScheduleSchema);
