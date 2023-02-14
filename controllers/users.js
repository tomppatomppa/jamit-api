const bcrypt = require('bcrypt')

const router = require('express').Router()
const User = require('../models/user')

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

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const createdUser = await User.create({
    ...req.body,
    passwordHash: passwordHash,
  })

  res.status(200).json(createdUser)
})

router.delete('/', userFromToken, async (req, res) => {
  console.log(req.user.username, req.body.username)
  if (req.user.username !== req.body.username) {
    return res.status(403).json({ error: 'No permission to delete this user' })
  }
  await User.destroy({
    where: {
      id: req.user.id,
    },
  })
  res.status(201).json(`Succesfully deleted user`)
})
module.exports = router
