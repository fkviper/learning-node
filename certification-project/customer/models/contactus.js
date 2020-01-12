const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const contactusModel = new Schema({
    name: {type:String},
    email: {type:String},
    message: {type:String},
    time: {type:Number}
})

// model name : contactus
// collection name : contactus_list
module.exports = mongoose.model('contactus', contactusModel, 'contactus')