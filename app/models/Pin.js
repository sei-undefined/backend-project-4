// import mongoose schema
const Schema = require('mongoose').Schema
const Model = require('mongoose').model
// schema for pin model
const pinSchema = new Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    lat:{
        type: Number,
        required: true
    },
    lng:{
        type: Number,
        required: true
    },
    help:{
        type: Boolean,
        required: true
    },
    desc: {
        type: String
        // required:false
    }
},{
    timestamps: true
})
// define models
const Pin = new Model("Pin", PinSchema)
module.exports={Pin}