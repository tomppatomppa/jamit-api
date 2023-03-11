const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
  const user = await User.findByPk(req.user.id)
  res.status(200).json(user)
})

router.put('/', async (req, res) => {
  let updateField = {}

  if (req.body.name) {
    updateField = {
      name: req.body.name,
    }
  }
  await User.update(updateField, {
    where: {
      id: req.user.id,
    },
  })
  res.status(201).json('Profile Updated')
})
module.exports = router
