const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const contactusModel = new Schema({
    name: {type:String},
    email: {type:String},
    message: {type:String},
    time: {type:Number}
})

// model name : contact_model
// collection name : contacts
module.exports = mongoose.model('contact_model', contactusModel, 'contactus');