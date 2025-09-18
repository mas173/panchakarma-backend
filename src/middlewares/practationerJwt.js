const jsonwebtoken = require('jsonwebtoken');
const practitionerSchema = require('../models/practitioner.schema');

const PractJwtAuth =async (req, res, next) => {
  const token = req.cookies.panchakarma;
  console.log(token)
  
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env._SECRET);
    const user  = await practitionerSchema.findById(decoded.id).select("-password")
    
    // console.log(decoded)
    req.user = user;
    next()

  } catch (error) {
  
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
   
    
  }

}


module.exports =PractJwtAuth ;