'use strict';

const fs =require('fs');
const chalk = require('chalk');
const fsPromises = fs.promises;

module.exports.getemployeedetails = async () => {
    let projectJson = await fsPromises.readFile('project.json',{encoding: 'utf8'});
    let employeeJson =await fsPromises.readFile('employee.json',{encoding: 'utf8'});
    
    let projects = JSON.parse(projectJson);
    let employees = JSON.parse(employeeJson);
    data = {
        ...projects.projects,
        ...employees.employees
    }
    return data;
};

 module.exports.getEmployeeById = async (id) =>{
    let data = await fsPromises.readFile('employee.json',{encoding: 'utf8'});
    let employee = JSON.parse(data);
    let employeeArray = [...employee.employees];
    let oEmployee = employeeArray.find((emp)=>{
        return emp.employeeId == id;
    });
    return oEmployee;     
}

module.exports.getProjectById = async (id) =>{
    let data = await fsPromises.readFile('project.json',{encoding: 'utf8'});
    let project = JSON.parse(data);
    let projectArray = [...project.projects];
    let oProject = projectArray.find((p)=>{
        return p.projectId == id;
    });
    return oProject;
}

