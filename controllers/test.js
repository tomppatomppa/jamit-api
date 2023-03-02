const router = require('express').Router()

router.post('/', async (req, res) => {
  if (!req.body.username) return res.status(400).json('Something went wrong')

  res.status(200).json(`hello ${req.body.username}`)
})
module.exports = router
