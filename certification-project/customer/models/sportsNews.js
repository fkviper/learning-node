const mongoose = require('mongoose')
const Schema = mongoose.Schema

const sportModel = new Schema({
    id:{type:Number},
    title: {type:String},
    image: {type:String},
    body: {type:String},
    date: {type:String},
    author: {type:String}
})

// model name : news_model
// collection name : news
module.exports = mongoose.model('sport_model', sportModel, 'news-sports')