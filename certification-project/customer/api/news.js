const express = require('express');
const router = express.Router();

import axios from 'axios';
router.get('/sports', (req,res)=>{

    const d = new Date().toISOString()
    const today = d.substring(0,10)
    console.log("today : ", today)

    const apiUrl = 'https://newsapi.org/v2/top-headlines' 
    axios.get(apiUrl, {
            params: {
                sources: 'espn, nfl-news, the-sport-bible',
                from: today,
                sortBy: 'popularity',
                language: 'en',
                apiKey: '98129a2a05e845ef84fec4963493b12e'
            }
        })
        .then( (response)=>{
            const data = response.data.articles
            console.log("/sports : data => ", data)
            res.render('sports', {data})
        })
        .catch(function (error) {
            console.log(error);
        })
});

module.exports = router;

