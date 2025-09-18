const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const  connectDB = async () => { 

  try {
  await  mongoose.connect(process.env._DB_URI)
  
    console.log("MongoDB connected");

  } catch (error) {
    console.log("Error in DB connection", error);
    
  }
}

module.exports = connectDB;