const router = require('express').Router()

const { Event } = require('../models/index')
const { sequelize } = require('../util/db')

const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  if (req.body.search) {
    //(xmin, ymin) && (xmax, ymax) = bottom left and top right corner of a rectangle
    const { xmin, ymin, xmax, ymax, excludedIds = [] } = req.body.search
    const exludeQuery = excludedIds.length
      ? `AND id NOT IN (${req.body.search.excludedIds.join(',')})`
      : ''
    const eventsInsideArea = await sequelize.query(
      //For accurate results, 4326 has to match the coordinate system used in your model
      `SELECT * FROM events WHERE ST_Intersects(location, ST_MakeEnvelope(${xmin},${ymin},${xmax},${ymax}, 4326)) ${exludeQuery}`
    )
    return res.status(200).json(eventsInsideArea[0])
  }

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
