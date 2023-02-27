const router = require('express').Router()

const { Event } = require('../models/index')
const { sequelize } = require('../util/db')

const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  if (Object.keys(req.query).length !== 0) {
    //query options
    //TODO: check for valid cooridnate values
    const { xmin, ymin, xmax, ymax, excludedIds = '' } = req.query

    const exludeQuery = excludedIds ? `AND id NOT IN (${excludedIds})` : ''
    const eventsInsideArea = await sequelize.query(
      //For accurate results, 4326 has to match the coordinate system used in your model
      `SELECT * FROM events id WHERE ST_Intersects(location, ST_MakeEnvelope(${xmin},${ymin},${xmax},${ymax}, 4326)) ${exludeQuery} LIMIT 200;`
    )

    return res.status(200).json(eventsInsideArea[0])
  }

  //TODO: why is the query returning userId field when it doesnt exists in the model
  const allEvents = await Event.findAll({ attributes: { exclude: ['userId'] } })
  return res.json(allEvents)
})

router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  return res.status(200).json(event)
})

router.post('/', userFromToken, async (req, res) => {
  const createdEvent = await Event.create({
    ...req.body,
    user_id: req.user.id,
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
