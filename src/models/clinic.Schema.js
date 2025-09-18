const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const clinicAdded = require("../emails/clinicAdded");

const clinicSchema = new mongoose.Schema(
  {
    clinicName: {
      type: String,
      required: true,
    },
    branchCode: {
      type: String,

      unique: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true, unique: true },
    },
    email: {
      type: String,
      required: true,
    },

    password: { type: String, required: true },

    practitioners: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    patients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Patient", // Patients in this clinic
      },
    ],
    facilities: [
      {
        type: String, // e.g., "Massage Room", "Steam Therapy", "Detox Hall"
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    onBoarded: {
      type: Boolean,
      default: false,
    },
    isDefaultPass:{
      type:Boolean,
      default:true
    },
    registered:{
      type:Boolean,
      default:false
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
  },
  { timestamps: true }
);




clinicSchema.pre("save", async function (next) {
  if (!this.branchCode) {
    this.branchCode =
      this.address.city.replace(/\s+/g, "") + this._id.toString().slice(-4);
    next();
  }
});

clinicSchema.pre("save", async function (next) {
  const passChangeLink = "#";
  const plainPass = this.password

  if (!this.registered) {
    await clinicAdded(
      this.clinicName,
      this.branchCode,
      
      this.email,
    plainPass,
      passChangeLink,
    );
    this.registered = true
  }

  next();
});

// Hash clinic password before saving
clinicSchema.pre("save", async function (next) {
   
  
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});



module.exports = mongoose.model("Clinic", clinicSchema);
