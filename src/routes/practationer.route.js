const express = require("express");
const {
  practationerRegister,
  practationerEmailVerfication,
  practitionerOnboard,
  practitionerLogin,
  practitionerAuth,
  practitionerLogout,
} = require("../controllers/practitionerController");
const JwtAuth = require("../middlewares/JwtAuth");
const { getSymptoms } = require("../controllers/patientController ");
const PractJwtAuth = require("../middlewares/practationerJwt");

const practationerRoute = express.Router();

practationerRoute
  .post("/register", practationerRegister)
  .post("/verify/email", practationerEmailVerfication)
  .post("/onboard", PractJwtAuth, practitionerOnboard)
  .post("/logout", PractJwtAuth, practitionerLogout)
  .post("/login", practitionerLogin)
  .get("/auth/me",PractJwtAuth,practitionerAuth)
  


module.exports = practationerRoute;
