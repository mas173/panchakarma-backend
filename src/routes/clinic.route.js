const express = require('express');

const JwtAuth = require('../middlewares/JwtAuth');
const { clinicLogin, changePass, clinicResetpass, sendResetOtp } = require('../controllers/clinic.controller');

const clinicRoutes = express.Router()


clinicRoutes
.post("/login",clinicLogin)
.post("/password/change",JwtAuth,changePass)
.post("/password/reset",clinicResetpass)
.post("/password/reset/otp",sendResetOtp)




module.exports = clinicRoutes