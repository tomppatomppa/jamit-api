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

router.put('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  const { name } = req.body
  event.name = name
  await event.save()

  res.json(event)
})
module.exports = router
