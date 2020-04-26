const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const usersRoutes = require('./users/index')
require('dotenv').config();
const app = express();
app.disable('x-powered-by');
app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/users', usersRoutes);

module.exports = app;