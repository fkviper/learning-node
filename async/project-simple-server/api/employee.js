var express = require('express');
var router = express.Router();
const chalk = require('chalk');
var db = require('../data');

router.use((req, res, next)=> {
  console.log('[employee] Time: ', Date.now())
  next()
})

router.get('/:id', async function (req, res) {
  try{
    const emp = await db.getEmployeeById(req.params.id);
    res.json(emp);
  }
  catch(e){
    res.json(e);
  }
  
})

module.exports = router