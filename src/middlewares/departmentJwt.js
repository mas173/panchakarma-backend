const jsonwebtoken = require('jsonwebtoken');
const practitionerSchema = require('../models/practitioner.schema');
const departmentSchema = require('../models/department.schema');

const departmentJwtAuth =async (req, res, next) => {
  const token = req.cookies.panchakarma;
  // console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env._SECRET);
    const user  = await departmentSchema.findById(decoded.id).select("-password")
    
    // console.log(decoded)
    req.user = user;
    next()

  } catch (error) {
  
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
   
    
  }

}


module.exports =departmentJwtAuth ;