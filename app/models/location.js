// import mongoose schema
const mongoose = require('mongoose')

// point schema
const pointSchema = new mongoose.Schema({
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  });

// schema
const LocationSchema = new mongoose.Schema({
    pinsIds:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pin'
    }],
    // owenerIds:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     // unique: true
    // }],
    location:{
        type:pointSchema,
        required:true
    },
    // location:{
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Point'
    // },
    orgConfirm:{
        type: String,
        default: null
    }
})
// define models
const Location = mongoose.model("Location", LocationSchema)
module.exports=Location