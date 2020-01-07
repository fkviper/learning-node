const app = require('./app');
const express = require('express');
const port = 3001;
const bodyParser =  require('body-parser');
const session = require('express-session');


app.use(express.static(__dirname+'/public'));

app.use(session({   secret: 'edurekaSecert',
                    resave: false,
                    saveUninitialized: true}));

app.set('view engine', 'ejs');
app.set('views', './views');

let sess;

app.get('/',(req,res) => {
    sess=req.session;
    sess.email=" "
   
    res.render('signin',
      { invalid: req.query.invalid?req.query.invalid:'',
        msg: req.query.msg?req.query.msg:''})
    
})

const server = app.listen(port, () => {
  console.log('Express server listening on port ' + port);
});