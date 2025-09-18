const jsonwebtoken = require('jsonwebtoken');
const patientSchema = require('../models/patient.schema');

const JwtAuth = async(req, res, next) => {
  const token = req.cookies.panchakarma;
  // console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env._SECRET);
    const user  = await patientSchema.findById(decoded.dbId).select("-password")
    // console.log(user)
    req.user = user;
    next()

  } catch (error) {
  
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
   
    
  }

}


module.exports = JwtAuth;