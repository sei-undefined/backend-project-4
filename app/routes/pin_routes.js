// import express
const express = require('express')
// import router into express
const router = express.Router()
// import pin model
const Pin = require('../models/pin')
// const Point = require('../models/point')
// import custom errors
const customErrors = require('../../lib/custom_errors')
const requireOwnership = customErrors.requireOwnership
// import passport
const passport = require('passport')
// JWT
const requireToken = passport.authenticate('bearer', {session: false})

// // index by range
// router.get('/pins', requireToken, async (req,res,next)=>{
//     await Pin.find({
//         location: {
//          $near: {
//           $maxDistance: 1000,
//           $geometry: {
//            type: "Point",
//            coordinates: [0, 0]
//           }
//          }
//         }
//        }).find((error, results) => {
//         if (error) console.log(error);
//         console.log(JSON.stringify(results, 0, 2));
//        });
//        res.sendStatus(111)
// })
// Index all users pins
// Get /pins
router.get('/allpins',requireToken,(req,res,next)=>{
    const ownerId = req.user._id
    Pin.find()
    .then(pins=>{
        res.status(200).json({pins:pins})
    })
    .catch(next)
})
// Index
// Get /pins
router.get('/pins',requireToken,(req,res,next)=>{
    const ownerId = req.user._id
    Pin.find({'owner_id': ownerId})
    .then(pins=>{
        res.status(200).json({pins:pins})
    })
    .catch(next)
})
// Create
// POST /pins
router.post('/pins', requireToken, async (req,res,next)=>{
    console.log('this is the CREATE Body',req.body)
    const newPin = new Pin(req.body.pin)
    newPin.owner_id = req.user._id
    newPin.location = req.body.pin.location
    newPin.save()
    .then(pin=>{
        // res.status(201).json({pin:pin})
        // console.log("redirect")
        // res.redirect(307, `/locations/${pin.lat}/${pin.lng}`)
        res.redirect(307, `/locations/${pin._id}`)
    })
    .catch(next)
})
// SHOW
// GET /pins/:id
router.get('/pins/:id',requireToken,(req,res,next)=>{
    pinId = req.params.id
    Pin.findById(pinId)
    .then(pin=>{
        requireOwnership(req, pin)
        res.status(200).json({pin:pin})
    })
    .catch(next)
})
// UPDATE
// PUT -> Large data
// PATCH -> small data
// PATCH /pins/:id
router.patch('/pins/:id',requireToken, (req,res,next)=>{
    const pinId = req.params.id
    const updatedPin = req.body.pin
    Pin.findById(pinId)
    .then((pin)=>{
        requireOwnership(req,pin)
        return pin.update(updatedPin)
    })
    .then(()=> res.sendStatus(204))
    .catch(next)
})
// DESTROY
// DELETE  /pins/:id
router.delete('/pins/:id',requireToken,(req, res, next)=>{
    const pinId = req.params.id
    Pin.findById(pinId)
    .then((pin)=>{
        requireOwnership(req,pin)
        return pin.remove()
    })
    .then(()=>res.sendStatus(204))
    .catch(next)
})
module.exports = router