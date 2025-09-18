const express = require('express');
const JwtAuth = require('../middlewares/JwtAuth');
const { generateStreamToken } = require('../lib/stream');
const { getStreamToken } = require('../controllers/chat.controller');
const PractJwtAuth = require('../middlewares/practationerJwt');


const chatRouter = express.Router();

chatRouter.use(JwtAuth)

chatRouter
.get("/token",JwtAuth,getStreamToken)
.get("/practitioner/token",PractJwtAuth,getStreamToken)


module.exports = chatRouter;