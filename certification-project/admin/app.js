const express = require('express');
const app = express();
const db = require('./db');

const auth = require('./api/auth');
const news = require('./api/news');

app.use('/api/auth', auth);
app.use('/api/news', news);

module.exports = app;