//connect to the database
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/update-web-app',{ useNewUrlParser: true,useUnifiedTopology: true })
.then(
    ()=>{console.log("Connected to Database")}
).catch(
    (err)=>{console.log("Not Connected to Database ERROR! ", err);}
);