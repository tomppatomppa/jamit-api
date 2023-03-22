const { User, Session } = require('../models')

const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer')
const { SECRET, SENDER, SENDER_PASSWORD } = require('../util/config')
const { sessionFrom } = require('../util/middleware')

router.post('/', async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json({ error: 'No username provided' })
  }

  const user = await User.findOne({
    where: {
      username,
    },
  })

  if (!user) return res.status(400).json({ error: 'User does not exist' })

  await Session.destroy({
    where: {
      user_id: user.id,
    },
  })

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET, {
    expiresIn: '120s',
  })

  await Session.create({ token, user_id: user.id })

  const result = await sendRecoveryEmail(token, username)

  if (result.accepted.length !== 0) {
    return res.status(200).json(
      `Recovery instructions sent to ${result?.accepted[0]}.
         Remember to check you junk folder!`
    )
  }

  await Session.destroy({
    where: {
      user_id: user.id,
    },
  })
  return res.status(400).json({ error: 'Something went wrong sending mail' })
})

router.put('/', async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json({
      error:
        'Please provide the code sent your email along with your new password',
    })
  }

  try {
    jwt.verify(token, SECRET)
  } catch (e) {
    if (e instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: e })
    }
    return res.status(400).json({ error: e })
  }

  const session = await sessionFrom(token)

  if (!session)
    return res.status(400).json({ error: 'The code you provided is invalid' })

  if (password.length < 8) {
    return res
      .status(401)
      .json({ error: 'Password must be at least 8 characters' })
  }

  await Session.destroy({
    where: {
      token,
    },
  })

  const saltRounds = 10
  const password_hash = await bcrypt.hash(password, saltRounds)

  session.user.password_hash = password_hash
  await session.user.save()

  res.status(200).json('Password has been reset')
})

const sendRecoveryEmail = async (token, username) => {
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: SENDER,
      pass: SENDER_PASSWORD,
    },
  })
  let info = await transporter.sendMail({
    from: `${SENDER}`,
    to: `${username}`,
    subject: 'Jamit password recovery',
    text: 'Use this code to login',
    html: `<b>Use the code provided to login through the app</b><p>CODE: ${token}</b>`,
  })

  return info
}
module.exports = router
