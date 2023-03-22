const { User, Session } = require('../models')
const { query } = require('express-validator')

const errorHandler = (error, req, res, next) => {
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).send({
      error: error.errors.map((e) => e.message),
    })
  }
  if (error.name === 'SequelizeDatabaseError') {
    console.log(error)
    return res.status(400).send({
      error: 'bad data...',
    })
  }
  if (error.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).send({
      error: error.errors.map((e) => e.message),
    })
  }

  next(error)
}

const sessionFrom = async (token) => {
  return await Session.findOne({
    where: {
      token,
    },
    include: {
      model: User,
    },
  })
}

const userFromToken = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (!authorization || !authorization.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'token missing' })
  }

  const session = await sessionFrom(authorization.substring(7))

  if (!session) {
    return res.status(401).json({ error: 'no valid session' })
  }

  if (session.user.disabled) {
    return res.status(401).json({ error: 'account disabled' })
  }

  req.user = session.user

  next()
}

function placeQueryValidation() {
  return [
    query('envelope')
      .optional()
      .custom((values) => {
        const coords = values.split(',')
        if (coords.length !== 4) {
          throw new Error('Invalid number of coordinates')
        }
        if (
          Math.min(coords[0], coords[2]) < -90 ||
          Math.max(coords[0], coords[2]) > 90
        ) {
          throw new Error(
            'Latitude value cannot be greater than 90 or less than -90'
          )
        }
        if (
          Math.min(coords[1], coords[3]) < -180 ||
          Math.max(coords[1], coords[3]) > 180
        ) {
          throw new Error(
            'Longitude value cannot be greater than 180 or less than -180'
          )
        }
        return true
      }),
    query('after').default(getDateYesterday()).isDate(),
  ]
}
function eventQueryValidation() {
  return [
    query('limit').default(3).isInt({ min: 1, max: 50 }),
    query('offset').default(0).isInt(),
  ]
}
//return yesterdays date as yyyy-mm-dd
const getDateYesterday = () => {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const isoDate = yesterday.toISOString().slice(0, 10)
  return isoDate
}

module.exports = {
  placeQueryValidation,
  errorHandler,
  userFromToken,
  sessionFrom,
  eventQueryValidation,
}
