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

// schema for pin model
const pinSchema = new mongoose.Schema({
    owner_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    location:{
        type:pointSchema,
        required:true
    },
    // location:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:"Point",
    //     required: true
    // },
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
pinSchema.index({ location: "2dsphere" });
const Pin = mongoose.model("Pin", pinSchema)
module.exports=Pin


