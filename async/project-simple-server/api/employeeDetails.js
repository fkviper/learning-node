const express = require('express');
const router = express.Router();
const chalk = require('chalk');
const db = require('../data');
const fetch = require('node-fetch');

let url = 'http://localhost:3000/';

router.use((req, res, next)=> {
  console.log('[employeeDetails] Time: ', Date.now())
  next()
})

router.get('/:id', async function(req, res){
    try{
        let employeeurl = 'http://localhost:3000/employees/' + req.params.id;
        let employee = await fetch(employeeurl);
        let employeeJson = await employee.json();
        let projectId = employeeJson.projectId;
        let projectUrl = 'http://localhost:3000/projects/' + projectId;
        let projects = await fetch(projectUrl);
        let projectJson = await projects.json();
        let employeeDetails = {
            ...employeeJson,
            description : projectJson.description,
            language : projectJson.language,
            company : projectJson.company
        };
        res.json(employeeDetails);
    }
    catch(e){
        res.json(e);
    }
})

module.exports = router