const router = require('express').Router()
const { Event } = require('../models/index')

router.get('/', async (req, res) => {
  const allEvents = await Event.findAll()
  res.json(allEvents)
})

router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)

  return res.status(200).json(event)
})
router.post('/', async (req, res) => {
  const createdEvent = await Event.create(req.body)
  res.status(200).json(createdEvent)
})

module.exports = router
