const express = require('express');
const { patientLogin , patientRegister, patientLogout , patientChangePassword, forgetOtp,resetpass, patientObnboarding, confirmReg, patientOtpVerify, getSymptoms} = require('../controllers/patientController ');
const JwtAuth = require('../middlewares/JwtAuth');
const fileUpload = require('../middlewares/mediaUpload');
const { bookconsultation, autobookConsult } = require('../controllers/consult.controller');


const patientRoute = express.Router()

patientRoute

.post('/login',patientLogin)
.post('/register',patientRegister)
.post('/logout',JwtAuth,patientLogout)
.post('/verifyotp',patientOtpVerify)
.post('/changepass',JwtAuth,patientChangePassword)
.post('/forgetotp',forgetOtp)
.post('/resetpass',resetpass)
.post('/onboarding',JwtAuth,patientObnboarding)
.post('/confirmreg',confirmReg)
.post("/add/dosha",JwtAuth, getSymptoms)
.post("/book/consult",JwtAuth, autobookConsult)
.get('/auth/me',JwtAuth,(req,res)=>{
  return res.status(200).json({
  
    user:req.user,
    role:"patient"
  })
})

module.exports = patientRoute;