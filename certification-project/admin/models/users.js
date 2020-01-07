const mongoose = require('mongoose');

var userModel = new mongoose.Schema({
    name:  String, // String is shorthand for {type: String}
    password: String,
    email:   String
});

module.exports  = mongoose.model('User', userModel,'users');

