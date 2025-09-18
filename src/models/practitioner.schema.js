const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const practitionerSchema = new mongoose.Schema({
  // Phase 1
  email: { type: String, required: true, unique: true },
  mobNum: { type: String },
  password: { type: String, required: true },
  isEmailVerified: { type: Boolean, default: false },

  // Phase 2
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "others"] },
  dob: { type: Date },
  nationality: { type: String, enum: ["indian", "foreign"], default: "indian" },
  govtId: {
    name: { type: String, required: true },
    idNum: { type: String },
    url: { type: String },
  },
  profilePic: { type: String },

  // Phase 3
  highestQualification: {
    type: String,
    enum: ["BAMS", "MD Panchakarma", "MD Kayachikitsa", "PhD"],
  },
  university: { type: String, trim: true },
  yearOfPassing: { type: Number, min: 1950, max: new Date().getFullYear() },
  rollNumber: { type: String, trim: true },
  internshipCertificate: { type: String },
  degreeCertificate: { type: String },

  // Phase 4
  regNo: { type: String },
  stateCouncil: { type: String },
  regDate: { type: Date },
  regCertificate: { type: String },
  specialization: { type: [String] },

  // Phase 5
  therapiesOffered: {
    type: [String],
    enum: [
      "Vamana",
      "Virechana",
      "Basti",
      "Nasya",
      "Raktamokshana",
      "Abhyanga",
      "Shirodhara",
      "Pizhichil",
      "Udvartana",
      "Netra Tarpana",
    ],
    required: true,
  },
  consultationFee: { type: Number, required: true, min: 0 },
  followUpFee: { type: Number, required: true, min: 0 },

  // Phase 6
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: "Clinic" },
  selfDeclaration: { type: Boolean, default: false },
  consent: { type: Boolean, default: false },
  isOnboarded: { type: Boolean, default: false },

  // Status
  status: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  weeklySchedule:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Schedule"
  },
  
}, { timestamps: true });

// Hash password
practitionerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

 

module.exports = mongoose.model("Practitioner", practitionerSchema);
