const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const departmentEmail = require("../emails/departmentEmail");



const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
  },
  description: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    
  },
  password: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

departmentSchema.pre("save", async function (next) {
  const pass = `DEPT${Math.floor(100000 + Math.random() * 900000)}`;
  const hasPass = await bcrypt.hash(pass, 10);
 this.password = hasPass;


  this.userId = this._id.toString().slice(-6).toUpperCase();
  departmentEmail(this.name,this.email, pass, this.userId);
  
 
  next();
});

module.exports = mongoose.model("Department", departmentSchema);
