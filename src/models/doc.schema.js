const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const docSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  specialization: { type: String, required: true },
  licNo: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  profileImage: { type: String },
  certifications: { type: [String], default: [] },
  clinic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Clinic",
    required: true,
  },
  docId: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    minlength: 6,
  },
  isVerified: {
    type: Boolean,
    enum: [true, false],
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  createdAt: { type: Date, default: Date.now },
});

docSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const hashpass = await bcrypt.hash(this.password, 10);
  this.password = hashpass;

  next();
});

docSchema.pre("save", function (next) {
  if (!this.docId) {
    this.docId = "DOC" + this._id.toString().slice(-5).toUpperCase();
  }
  next();
});


module.exports = mongoose.model("Doctor", docSchema);
