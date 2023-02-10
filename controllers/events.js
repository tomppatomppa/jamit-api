const route = require('express').Router()
const { Event } = require('../models/index')

route.get('/', async (req, res) => {
  const allEvents = await Event.findAll()
  res.json(allEvents)
})

route.post('/', async (req, res) => {
  const createdEvent = await Event.create(req.body)
  console.log(createdEvent.errors)
  if (!createdEvent) {
    res.status(400).json({ error: createdEvent })
  }
  res.status(200).json(createdEvent)
})
module.exports = route
