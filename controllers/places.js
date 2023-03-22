const router = require('express').Router()
const { Place, Event } = require('../models/')
const { Op, literal } = require('sequelize')
const sequelize = require('sequelize')
const { placeQueryValidation } = require('../util/middleware')
const { validationResult } = require('express-validator')
//TODO: validations
router.get('/', placeQueryValidation(), async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  if (!req.query.envelope) {
    const allPlaces = await Place.findAll({
      include: {
        model: Event,
        as: 'data',
      },
    })
    return res.status(200).json(allPlaces)
  }
  //Find all places inside the given envelope,
  const places = await Place.findAll({
    attributes: [
      'id',
      'name',
      'facebook_profile',
      'location',
      [sequelize.fn('COUNT', sequelize.col('data.id')), 'eventCount'],
    ],
    include: [
      {
        model: Event,
        as: 'data',
        attributes: [],
        where: {
          start_date: {
            [Op.gte]: '2023-03-01',
          },
        },
        required: false,
      },
    ],
    where: literal(`ST_Intersects(
      "place"."location",
      ST_MakeEnvelope(${req.query.envelope}, 4326)
    )`),

    group: ['place.id'],
  })

  res.status(200).json(places)
})

router.get('/:id', async (req, res) => {
  const place = await Place.findByPk(req.params.id, {
    include: [
      {
        model: Event,
      },
    ],
  })

  res.status(200).json(place)
})

router.post('/', async (req, res) => {
  const user = await Place.create(req.body)
  res.status(200).json(user)
})

module.exports = router
