const express = require('express');
const app = express();
const db = require('./db');

const contactus = require('./api/contactus');
const weather = require('./utility/weather');


app.use('/api/contactus',contactus);


module.exports = app;