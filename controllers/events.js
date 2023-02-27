const router = require('express').Router()

const { Event } = require('../models/index')
const { sequelize } = require('../util/db')

const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    //query options
    //TODO: check for valid cooridnate values
    const {
      xmin,
      ymin,
      xmax,
      ymax,
      excludedIds = '',
      filterByDate = '',
    } = req.query
    console.log(filterByDate)
    const exludeQuery = excludedIds ? `AND id NOT IN (${excludedIds})` : ''
    const eventsInsideArea = await sequelize.query(
      //For accurate results, 4326 has to match the coordinate system used in your model
      `SELECT * FROM events WHERE ST_Intersects(location, ST_MakeEnvelope(${xmin},${ymin},${xmax},${ymax}, 4326)) ${exludeQuery}`
    )

    return res.status(200).json(eventsInsideArea[0])
  }

  const allEvents = await Event.findAll()
  return res.json(allEvents)
})

router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  return res.status(200).json(event)
})

router.post('/', userFromToken, async (req, res) => {
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
