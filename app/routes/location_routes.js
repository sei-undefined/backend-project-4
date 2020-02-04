// import mongoose
const mongoose = require('mongoose')
// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Location = require('../models/location')
const Pin = require('../models/pin')
// const Point = require('../models/point')
// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// // Testing route
// router.get('locations/test', requireToken,(req, res,next) => {
//     Location.find({})
//     .then(locations =>{
//         res.status(200).json({locations})
//     })
//     .catch(next)
// })


// index 
// GET - /locations 
router.get('/locations', requireToken, (req,res,next) => {
    Location.find({}).populate()
    .then(locations => {
        res.status(200).json({locations:locations})
    })
    .catch(next)
})

// create
// POST - /locations
router.post('/locations/:pinId', requireToken, async (req,res,next) => {
    const pin = await Pin.findById(req.params.pinId)
    // const createdPoint = await Point.findById(req.params.pointId)
    const loc = pin.location.coordinates.slice(0,2)
    console.log(loc)

    // find number of nearby pins
    const NearbyPins = await Pin.find({
        location: {
         $near: {
          $maxDistance: 0,
          $geometry: {
           type: "Point",
           coordinates: loc
          }
         }
        }
       })
    // console.log(NearbyPins,'length',NearbyPins.length );
    
    if (NearbyPins.length == 1) {
        console.log("new location")
        const newLocation = new Location()
    newLocation.pinsIds = pin._id
    newLocation.location=pin.location
    newLocation.save()
    .then(location => res.status(222).json({location,pin}))
    }else{
        console.log("push to location")
        const filter = {pinsIds: NearbyPins[0]._id}
        let update = {$addToSet:{pinsIds: req.params.pinId}}
        const updatedLocation = await Location.findOneAndUpdate(filter,update)
        // console.log(updatedLocation)

        // console.log(updatedLocation[0].pinsIds.concat(req.params.pinId))
        // updatedLocation[0].pinsIds= updatedLocation[0].pinsIds.concat(req.params.pinId)
        // updatedLocation.update()
        // .then(location=>res.status(787).json(location))
        // updatedLocation
    }
    //  // Number of nearby pins 
    // res.status(999).json(nearbyPin.length) 
    // console.log(pin._id)
    
    // res.sendStatus(888)
        // res.status(201).json({pin:pin},{location:location}) )
    
})


//show
// GET - /locations/:id
router.get('/locations/:id',requireToken, (req,res,next) => {
    const locationId = req.params.id
    Location.findById(locationId)
    .then(location => {
        res.status(200).json({location:location})
    })
    .catch(next)
})

// //Update
// // PATCH - /locations/:id
// router.patch('/locations/:id',(req,res) => {
//     const locationBody = req.body.location;
//     const locationId = req.params.id;
//     location.findByIdAndUpdate(locationId,locationBody)
//     .then((location) => res.status(204))
//     .catch(console.error)
// })


// //Destroy
// // Delete - /locations/:id
// router.delete('/locations/:id',(req,res) => {
//     const locationsId = request.params.id
//     location.findByIdAndDelete(locationId)
//     .then(() => response.sendStatus(204))
//     .catch(console.error)
// })

module.exports =  router;