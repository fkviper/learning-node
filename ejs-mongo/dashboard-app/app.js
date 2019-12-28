const express = require('express');
const app = express();
var path = require('path');
const chalk = require('chalk');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',(req,res)=>{
    res.render('index',{page:'Home', menuId:'home'});
})

app.listen(3002,()=>{
    console.log(chalk.magenta.bold("[web-server] server started on port 3000"));
})