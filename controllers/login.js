const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const router = require('express').Router()

const { SECRET } = require('../util/config')
const { User, Session } = require('../models')
const { userFromToken } = require('../util/middleware')

router.get('/', async (req, res) => {
  const allSessions = await Session.findAll()
  res.json(allSessions)
})
router.post('/', async (req, response) => {
  const { username, password } = req.body

  if (!username || !password) {
    response.status(400).json({ error: 'invalid request' })
  }

  const user = await User.findOne({
    where: {
      username: username,
    },
  })

  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password',
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  await Session.create({ token, userId: user.id })

  response.status(200).send({ token, username: user.username })
})

router.delete('/', userFromToken, async (req, res) => {
  await Session.destroy({
    where: {
      userId: req.user.id,
    },
  })

  res.status(200).send({
    message: 'token revoken',
  })
})

module.exports = router
