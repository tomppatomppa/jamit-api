const bcrypt = require('bcrypt')
const { User } = require('../models/index')

const router = require('express').Router()

const { userFromToken } = require('../util/middleware')

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
    return res.status(401).json({ error: 'Username or Password missing' })
  }
  if (password.length < 8) {
    return res
      .status(401)
      .json({ error: 'Password must be at least 8 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const createdUser = await User.create({
    ...req.body,
    password_hash: passwordHash,
  })

  return res.status(200).json(createdUser)
})

router.delete('/', userFromToken, async (req, res) => {
  const user = await User.findByPk(req.user.id)
  await user.destroy()

  return res.status(201).json(`Succesfully deleted user`)
})
module.exports = router
