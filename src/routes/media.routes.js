const express = require('express');
const profileUpload = require('../controllers/media.controller');

const mediaRoutes = express.Router()

mediaRoutes
.post("/upload/profile",profileUpload)



module.exports = mediaRoutes