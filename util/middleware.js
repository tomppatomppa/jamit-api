const { User, Session } = require('../models')
const {
  oneOf,

  check,
  query,
} = require('express-validator')
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
  console.log(session.user)
  req.user = session.user

  next()
}

function eventQueryValidation() {
  return [
    oneOf([
      [
        check('xmin')
          .exists()
          .custom((value) => {
            if (value > 90 || value < -90) {
              throw new Error('xmin cannot be greater than 90 or less than -90')
            }
            return true
          }),
        check('ymin')
          .exists()
          .custom((value) => {
            if (value > 180 || value < -180) {
              throw new Error(
                'ymin cannot be greater than 180 or less than -180'
              )
            }
            return true
          }),
        check('xmax')
          .exists()
          .custom((value) => {
            if (value > 90 || value < -90) {
              throw new Error('xmax cannot be greater than 90 or less than -90')
            }
            return true
          }),
        check('ymax')
          .exists()
          .custom((value) => {
            if (value > 180 || value < -180) {
              throw new Error(
                'ymax cannot be greater than 180 or less than -180'
              )
            }
            return true
          }),
      ],
    ]),
    query('limit')
      .default(50)
      .isNumeric()
      .custom((value) => {
        if (value && value > 200) {
          throw new Error('limit cannot be greater than 200')
        }
        if (value && value < 1) {
          throw new Error('limit cannot be less than 1')
        }
        return true
      }),
    query('after').default(getDateYesterday()).isDate(),
    query('before').default('3000-12-31').isDate(),
    query('exludedIds').optional().isArray(),
    //TODO: validation for integer values
  ]
}
//return yesterdays date as yyyy-mm-dd
const getDateYesterday = () => {
  const yesterday = ((d) => new Date(d.setDate(d.getDate() - 1)))(new Date())
    .toISOString()
    .slice(0, 10)
  return yesterday
}
module.exports = {
  eventQueryValidation,
  errorHandler,
  userFromToken,
}
