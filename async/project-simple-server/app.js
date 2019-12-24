const express = require('express')
const app = express();
const chalk = require('chalk');
var project = require('./api/project')
var employee = require('./api/employee')
var router = express.Router();

app.use('/projects', project);
app.use('/employees', employee);


app.listen(3000,()=>{
    console.log(chalk.magenta.bold("[web-server] server started on port 3000"));
})