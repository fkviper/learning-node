const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const ContactUs = require('../models/contactus');

router.post('/', (req,res)=>{
    console.log("/api/contactus/ : req.body : ", req.body);
    const d = Date.now();
    const record = {...req.body,
      time: d
    };
    ContactUs.create(
                record  
              , (err, data) => {
                  if(err) return res.status(500).send('There was a problem registering.')
                  const htmlMsg = encodeURIComponent('Your Query Sent Succesfully !');
                  res.redirect('/api/contactus?msg=' + htmlMsg);
        }); 
});

module.exports = router;