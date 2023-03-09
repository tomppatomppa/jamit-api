const router = require('express').Router()
const { Place, Event } = require('../models/')
const { Op, literal } = require('sequelize')
const sequelize = require('sequelize')

//TODO: validations
router.get('/', async (req, res) => {
  //Find all places inside the given envelope,
  const places = await Place.findAll({
    attributes: [
      'id',
      'name',
      'facebook_profile',
      'location',
      [sequelize.fn('COUNT', sequelize.col('events.id')), 'eventCount'],
    ],
    include: [
      {
        model: Event,
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
