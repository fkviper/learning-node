const express = require('express');
const router = express.Router();
const Contactuslist = require('./models/contactus')


router.post('/', (req,res)=>{
    console.log("/addContactUs : req.body : ", req.body);
    const record = req.body;
    Contactuslist.create(
            record  
        , (err, data) => {
            if(err){
                const htmlMsg = encodeURIComponent('Error : ', error);
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }else{
                const htmlMsg = encodeURIComponent('ContactUs Message Saved OK !');
                res.redirect('/contact_us/?msg=' + htmlMsg)
            }
            
        });
    
});

module.exports = router;