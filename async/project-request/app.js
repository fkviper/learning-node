const request = require('request');


const url = 'http://5c055de56b84ee00137d25a0.mockapi.io/api/v1/employees';

request(url,{json:true},(error,response,body)=>{
    if(error) return console.log('Failed to connect to the server.');
    if(response.body.error) return console.log('Invalid URL provided.');
    const employees = body.map((emp)=>{
        return {
            Name : emp.name,
            Id : emp.id,
            CreatedAt : emp.createdAt
        }
    });
    console.log(employees);
});


