const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

const ContactUs = require('../models/contactus');

router.post('/', (req,res)=>{
    console.log("/api/contactus/ : req.body : ", req.body)
    const record = req.body;
    ContactUs.create(
                record  
              , (err, data) => {
                  if(err) return res.status(500).send('There was a problem registering.')
                  console.log(`Inserted ... ${data}`)
                  return res.status(200).send("Inserted");
        }); 
});

module.exports = router;