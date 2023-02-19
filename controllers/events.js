const router = require('express').Router()
const { Event } = require('../models/index')

const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  const allEvents = await Event.findAll()
  res.json(allEvents)
})

router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  return res.status(200).json(event)
})

router.post('/', userFromToken, async (req, res) => {
  console.log('USER ID', req.user.id)
  const createdEvent = await Event.create({
    ...req.body,
    userId: req.user.id,
  })
  res.status(200).json(createdEvent)
})

router.put('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  const { name } = req.body
  event.name = name
  await event.save()

  res.json(event)
})

router.delete('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  if (!event) {
    res.status(404).json(`Event id ${req.params.id} not found`)
    return
  }
  await event.destroy()
  res.status(200).json('Event has been deleted')
})
module.exports = router
