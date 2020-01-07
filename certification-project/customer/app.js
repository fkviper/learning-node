import express from 'express';
const app = express();
const db = require('./db');

const news = require('./api/news');
const contactus = require('./api/contactus');
const weather = require('./utility/weather');


app.use('/api/weather', waether);
app.use('/api/news', news);
app.use('api/contactus/',contactus);


module.exports = app;