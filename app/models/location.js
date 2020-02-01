// import mongoose schema
const Schema = require('mongoose').Schema
const Model = require('mongoose').model
// schema
const LocationSchema = new Schema({
    pins:[{
        type: Schema.Types.ObjectId,
        ref: 'Pin'
    }]
})
// define models
const Location = new Model("Location", LocationSchema)
module.exports={Location}