const router = require('express').Router()
const { Place } = require('../models/')

router.get('/', async (req, res) => {
  // const user = await Place.findAll({
  //   include: {
  //     model: Event,
  //   },
  // })
  const allPlaces = await Place.findAll({})
  res.status(200).json(allPlaces)
})

router.post('/', async (req, res) => {
  const user = await Place.create(req.body)
  res.status(200).json(user)
})
module.exports = router
