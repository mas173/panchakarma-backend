const mongoose = require("mongoose");
const regEmail = require("../emails/regEmail");


const patientSchema = new mongoose.Schema(
  {
    patientId: {
      type: String,

      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: String,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    dob: {
      type: Date,
    },
    contactNumber: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    emergencyContact: {
      type: String,
      minlength: 10,
      maxlength: 10,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    
    },
    height: {
      type: Number,
      min: [30, "Height seems too small"],
      max: [300, "Height seems too large"],
    },

    weight: {
      type: Number,
      min: [1, "Weight seems too low"],
      max: [500, "Weight seems too high"],
    },

    allergies: {
      type: [String],
      default: [],
    },
    isverified:{
      type: Boolean,
      default: false,
    },
    isOnboarded: {
      type: Boolean,
      default: false,
    },
    profileUrl: {
      type: String,
      
    },
    symptoms:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Dosha"
    }
  },
  { timestamps: true }
);

patientSchema.pre("save", function (next) {
  if (!this.patientId) {
    this.patientId = this._id.toString().slice(-8).toUpperCase();
    // Send registration email
  }

  next();
});

module.exports = mongoose.model("Patient", patientSchema);
