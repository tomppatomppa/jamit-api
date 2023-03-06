const router = require('express').Router()
const { Place, Event } = require('../models/')
const { Op, literal } = require('sequelize')

//TODO: validations
router.get('/', async (req, res) => {
  //Find all places inside the give envelope,
  // and has events that are scheduled before a specified date

  if (req.query.envelope && req.query.before) {
    const allPlaces = await Place.findAll({
      attributes: ['id', 'name', 'location'],
      include: {
        model: Event,
        attributes: [],
        where: {
          start_date: { [Op.lt]: req.query.before || '3000-12-12' },
        },
      },
      where: literal(`ST_Intersects(
          "place"."location",
          ST_MakeEnvelope(${req.query.envelope}, 4326)
        )`),
      raw: true,
      nest: true,
    })
    return res.status(200).json(allPlaces)
  }

  const places = await Place.findAll()

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
