const router = require('express').Router()
const { Place, Event } = require('../models/')

router.get('/', async (req, res) => {
  const user = await Place.findAll({
    include: {
      model: Event,
    },
  })
  res.status(200).json(user)
})

router.post('/', async (req, res) => {
  const user = await Place.create(req.body)
  res.status(200).json(user)
})
module.exports = router
