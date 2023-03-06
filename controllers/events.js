const { validationResult } = require('express-validator')
const router = require('express').Router()

const { Event, Place } = require('../models/index')
const { sequelize } = require('../util/db')

const { userFromToken, eventQueryValidation } = require('../util/middleware')

// router.get('/', eventQueryValidation(), async (req, res) => {
//   const errors = validationResult(req)
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() })
//   }
//   const {
//     xmin,
//     ymin,
//     xmax,
//     ymax,
//     excludedIds = '',
//     limit,
//     after,
//     before,
//   } = req.query

//   const exludeQuery = excludedIds ? `AND id NOT IN (${excludedIds})` : ''
//   const eventsInsideArea = await sequelize.query(
//     //For accurate results, 4326 has to match the coordinate system used in your model
//     `SELECT * FROM events id WHERE start_date > '${after}'
//      AND start_date < '${before}'
//      AND ST_Intersects(location, ST_MakeEnvelope(${xmin},${ymin},${xmax},${ymax}, 4326))
//      ${exludeQuery}
//      LIMIT ${limit};`
//   )

//   return res.status(200).json(eventsInsideArea[0])
// })

//TODO: pagination
router.get('/', async (req, res) => {
  const { offset, place_id } = req.query

  let where = {}

  if (req.query.place_id) {
    where = {
      place_id: place_id,
    }
  }

  const limit = 3
  const allEvents = await Event.findAndCountAll({
    where,
    offset: offset,
    limit: limit,
    order: [['start_date', 'ASC']],
  })

  let hasMore = true
  if (Number(offset) + limit >= allEvents.count) {
    hasMore = false
  }

  return res.status(200).json({ ...allEvents, hasMore })
})
router.get('/:id', async (req, res) => {
  const event = await Event.findByPk(req.params.id)
  return res.status(200).json(event)
})

router.post('/', userFromToken, async (req, res) => {
  const place = await Place.findOne({
    where: {
      facebook_profile: req.body.facebook_profile,
    },
  })
  if (!place) {
    return res
      .status(400)
      .json({ error: 'Confirm that the place where the event is held exists' })
  }

  const createdEvent = await Event.create({
    ...req.body,
    user_id: req.user.id,
    place_id: place.id,
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
