// import express
const express = require('express')
// import router into express
const router = express.Router()
// import pin model
const Pin = require('../models/Pin')
// import custom errors
const customErrors = require('../../lib/custom_errors')
const requireOwnership = customErrors.requireOwnership
// import passport
const passport = require('passport')
// JWT
const requireToken = passport.authenticate('bearer', {session: false})
// Index
// Get /pins
router.get('/pins',requireToken,(req,res,next)=>{
    const ownerId = req.user._id
    Pin.find({'owner': ownerId})
    .then(pins=>{
        res.status(200).json({pins:pins})
    })
    .catch(next)
})
// Create
// POST /pins
router.post('/pins', requireToken, (req,res,next)=>{
    const ownerId = req.user._id
    const newPin = req.body.pin
    newPin.owner = ownerId
    Pin.create(newPin)
    .then(pin=>{
        res.status(201).json({pin:pin})
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