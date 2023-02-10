const route = require('express').Router()
const { Event } = require('../models/index')

route.get('/', async (req, res) => {
  const allEvents = await Event.findAll()
  res.json(allEvents)
})

module.exports = route
