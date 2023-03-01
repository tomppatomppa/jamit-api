const { User, Session } = require('../models')

const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const nodemailer = require('nodemailer')
const { SECRET, SENDER, SENDER_PASSWORD } = require('../util/config')
const { sessionFrom } = require('../util/middleware')

//TODO: improve
router.post('/', async (req, res) => {
  const { username } = req.body

  if (!username) {
    return res.status(400).json('No username provided')
  }

  const user = await User.findOne({
    where: {
      username,
    },
  })
  if (!user) return res.status(400).json('User does not exist')

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
  return res.status(400).json('Something went wrong sending mail')
})

router.put('/', async (req, res) => {
  const { token, password } = req.body

  if (!token || !password) {
    return res.status(400).json('Invalid request')
  }

  const session = await sessionFrom(token)

  if (!session) return res.status(400).json('Something went wrong')

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
    secure: false, // true for 465, false for other ports
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: SENDER, // generated ethereal user
      pass: SENDER_PASSWORD, // generated ethereal password
    },
  })
  let info = await transporter.sendMail({
    from: `${SENDER}`, // sender address
    to: `${username}`, // list of receivers
    subject: 'Jamit password recovery', // Subject line
    text: 'Use this code to login', // plain text body
    html: `<b>Use the code provided to login through the app</b><p>CODE: ${token}</b>`,
  })

  return info
}
module.exports = router
