const express = require('express');
const { getPatientDetails } = require('../controllers/Details.controller');
const { getdoshas, chatbot } = require('../controllers/algo.controller');
const { alldocForconsultation } = require('../controllers/consult.controller');
const JwtAuth = require('../middlewares/JwtAuth');

const detailsroute = express.Router()

detailsroute
.get("/patient/detail",JwtAuth,getPatientDetails)
.get("/patient/predictDosha/:id",getdoshas)
.get("/practitioner/free/consult",alldocForconsultation)
.post("/chatbot",chatbot)

module.exports = detailsroute
