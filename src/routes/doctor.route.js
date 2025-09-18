const express = require('express');
const { docLogin, docRegister } = require('../controllers/DocController');

const DocRoute = express.Router()

DocRoute
.post('/login',docLogin)
.post('/register',docRegister)

module.exports = DocRoute;