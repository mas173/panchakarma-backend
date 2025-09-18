const appointMentSchema = require("../models/appointment/appointment")
const scheduleSchema = require("../models/appointment/schedule.schema");
const consultSchema = require("../models/consult.schema");
const practitionerSchema = require("../models/practitioner.schema");
const symptomsSchema = require("../models/symptoms.schema");
const getDayKeyFromName = require("../utils/daynumber");


const alldocForconsultation = async(req,res)=>{
 
try {
  const list = await practitionerSchema.find({

    $or: [
    { "slot2.consult1": "free" },
    { "slot2.consult2": "free" },
    { "slot2.consult3": "free" }
  ]


}).select("firstName lastName _id ")


return res.status(200).json({
  list
})
} catch (error) {
  return res.status(500).json({message:"server error try again later"})
  
}

}

const bookconsultation = async(req,res)=>{
 const id  = req.user._id
 const {docId} = req.body

 
 if(!docId){
  return res.status(400).json({
    message:"doctor is required for booking consultation"
  })
 }

 


 
try {

 const dosha = await symptomsSchema.find({patient:id})
//  console.log(dosha)

 if(dosha.length <1){
  return res.status(400).json({message:"please fill symptoms form before booking"})
 }

const practitioner = await practitionerSchema.findById(docId)

if(!practitioner){
  return res.status(400).json({
    message:"practitioner not found"
  })
}

// finding free consultation slot
const freeSlot = function freeslot(){
  if(  practitioner.slot2.consult1 =="free" ){
    return ["consult1","12:30-1:00"]
  }
    else if(  practitioner.slot2.consult2 =="free" ){
    return ["consult2","1:00-1:30"]
  }
  else{
    return ["consult1","1:30-2:0"]
  }

}

const [slotKey , slotTime] = freeSlot()

 practitioner.slot2[slotKey] = "booked"
 practitioner.save()

 const newConsult  = await consultSchema.create({
  patient:id,
  practitioner:docId,
  dignosis:dosha[0]._id,
  time:slotTime
 })


return res.status(200).json({
  message:"consultation booked succesfully!",
  details:newConsult
})




  
} catch (error) {
  console.log(error)
  return res.status(500).json({
    messsage
    :"server error"
  })
  
}



}

const autobookConsult = async (req,res)=>{
  const {day} = req.body
  const id = req.user._id




  if(!day){
    return res.status(400).json({
      message:"all fields are required!"
    })
  }


  try {
      const daynum = getDayKeyFromName(day)
 console.log(daynum)
    const freeslot = await  scheduleSchema.find({
  $or: [
    { "weeklySchedule.day1.slot2.status": "free" },
    { "weeklySchedule.day1.slot3.status": "free" },
    { "weeklySchedule.day1.slot4.status": "free" }
  ]
}).select(`_id practitionerId weeklySchedule.${daynum} `)



const firstDoc = freeslot[0];

// Access day1 Map
const day1Map = firstDoc.weeklySchedule.day1;

// Access a specific slot
// const slot1 = day1Map.get('slot1').name;
// console.log(slot1); // { status: 'free', patient: null }

// Loop through all slots in day1
let slot
let slotname
for (const [slotName, slotObj] of day1Map) {
  if( (slotName == "slot2" || slotName == "slot3" || slotName == "slot4") && (slotObj.status=="free")){
    slot=slotObj
    slotname=slotName
    break
  }
  // Example output: slot1 free, slot2 booked, slot3 free
}
// console.log(slotName, slotObj.status);
console.log(slot);

const newAppointment = await appointMentSchema.create({
  patientId:id,
  practitionerId:firstDoc.practitionerId,
  scheduleId:firstDoc._id,
  day:day,
  type:"consultation",
  slotName:slot.name
  
})


slot.status = "booked"
slot.appointmentId = newAppointment._id


await firstDoc.save()








return res.status(200).json({
  newAppointment
})
  } catch (error) {
  console.log(error)
  res.status(500).json({
    message:"error finding free slots"
  })
  }
}


module.exports = {alldocForconsultation ,bookconsultation ,autobookConsult}
