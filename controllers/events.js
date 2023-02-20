const router = require('express').Router()
const { Event } = require('../models/index')
const { QueryTypes } = require('sequelize')
const { sequelize } = require('../util/db')

const { userFromToken } = require('../util/middleware')

/**
 * The ST_DWithin function checks if the distance between the two geometries is less than or equal to the specified distance,
 * so it will return all events that are 50 meters away or less if you set the radius to 49 meters.
 * This is because the function calculates the distance between the centroids of the geometries,
 * which can be different from the actual distance between the closest points on the geometries.
 */
router.get('/', async (req, res) => {
  if (req.body.search) {
    const { radius, origin } = req.body.search
    const result = await sequelize.query(
      `SELECT * FROM events WHERE ST_DWithin(
        ST_Transform(location, 3857), 
        ST_Transform(ST_SetSRID(ST_MakePoint(${origin}), 4326), 3857), 
       ${radius}
      )`,
      {
        type: QueryTypes.SELECT,
      }
    )
    return res.json(result.length)
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
