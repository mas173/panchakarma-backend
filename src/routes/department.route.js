const express = require("express")
const{ departmentRegister, departmentLogin, departmentLogout, addClinic, verifyPractitioner, getAllApplication} = require("../controllers/Department.controller")
const JwtAuth = require("../middlewares/JwtAuth")
const departmentJwtAuth = require("../middlewares/departmentJwt")

const Deprouter  = express.Router()


Deprouter
.post('/add',departmentRegister)
.post('/login',departmentLogin)
.post('/logout',departmentLogout)
.post('/add/clinic',JwtAuth,addClinic)
.post("/practitioner/verify/:id",departmentJwtAuth,verifyPractitioner)
.get("/practitioner/applications",departmentJwtAuth,getAllApplication)


module.exports = Deprouter

