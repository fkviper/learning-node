const express = require('express');
const router = express.Router();

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

const userModel = require('../models/users');
const app = express();
/*app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static(__dirname+'/public'));
*/

// Register without JWT validation
router.post('/register', (req,res) => {
    console.log("/register : req.body ==> ", req.body)
    userModel.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg;
      if(!user)
      { 
        const hashedPasword = bcrypt.hashSync(req.body.password, 8);
        userModel.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPasword,
        }, (err, user) => {
            if(err) return res.status(500).send('There was a problem registering user')
            htmlMsg = encodeURIComponent('Registered OK !');
            res.redirect('/?msg=' + htmlMsg)
            //res.send(htmlMsg);
        })
      }
      else
      { //duplicate
        htmlMsg = encodeURIComponent('Email existing, please enter a new one ...');
        res.redirect('/?msg=' + htmlMsg);
        //res.send(htmlMsg);
      }
    })     
})

// Login User
router.post('/login', (req, res) => {

  userModel.findOne({ email: req.body.email }, (err, user) => {
      console.log("/login : user => ", user)
      if (err) return res.status(500).send('Error on the server.');
      let htmlMsg;
      if (!user) 
      { 
        htmlMsg = encodeURIComponent('Email not found, try again ...');
        res.redirect('/?invalid=' + htmlMsg);
      }else{
        const bIsValidPassword = bcrypt.compareSync(req.body.password, user.password);
        if (!bIsValidPassword) {
          return res.status(401).send({ auth: false, token: null });
        }

        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        localStorage.setItem('authtoken', token)

        res.redirect(`/api/news/form`)
      }
    });
});


router.get('/logout', (req,res) => {
    localStorage.removeItem('authtoken');
    res.redirect('/');
})

module.exports = router;

