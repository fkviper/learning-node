const mongoose = require('mongoose')
const Schema = mongoose.Schema

const newsModel = new Schema({
    title: {type:String},
    description: {type:String},
    url: {type:String},
    urlToImage: {type:String},
    publishedAt: {type:String},
    insertTime: {type:Number}
})

// model name : news_model
// collection name : news
module.exports = mongoose.model('news_model', newsModel, 'news')