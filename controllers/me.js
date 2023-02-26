const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
  const user = await User.findByPk(req.user.id)
  res.status(200).json(user)
})

module.exports = router
