const bcrypt = require('bcrypt')

const router = require('express').Router()
const User = require('../models/user')

router.get('/', async (req, res) => {
  const allUsers = await User.findAll()
  res.status(200).json(allUsers)
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  res.status(200).json(user)
})

router.post('/', async (req, res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(401).json({ error: 'Invalid payload' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const createdUser = await User.create({
    ...req.body,
    passwordHash: passwordHash,
  })

  res.status(200).json(createdUser)
})

module.exports = router
