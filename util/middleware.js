const { User, Session } = require('../models')
const { oneOf, check, query } = require('express-validator')

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

// function eventQueryValidation() {
//   return [
//     oneOf([
//       [
//         check('xmin')
//           .exists()
//           .custom((value) => {
//             if (value > 90 || value < -90) {
//               throw new Error('xmin cannot be greater than 90 or less than -90')
//             }
//             return true
//           }),
//         check('ymin')
//           .exists()
//           .custom((value) => {
//             if (value > 180 || value < -180) {
//               throw new Error(
//                 'ymin cannot be greater than 180 or less than -180'
//               )
//             }
//             return true
//           }),
//         check('xmax')
//           .exists()
//           .custom((value) => {
//             if (value > 90 || value < -90) {
//               throw new Error('xmax cannot be greater than 90 or less than -90')
//             }
//             return true
//           }),
//         check('ymax')
//           .exists()
//           .custom((value) => {
//             if (value > 180 || value < -180) {
//               throw new Error(
//                 'ymax cannot be greater than 180 or less than -180'
//               )
//             }
//             return true
//           }),
//       ],
//     ]),
//     query('limit')
//       .default(50)
//       .isNumeric()
//       .custom((value) => {
//         if (value && value > 200) {
//           throw new Error('limit cannot be greater than 200')
//         }
//         if (value && value < 1) {
//           throw new Error('limit cannot be less than 1')
//         }
//         return true
//       }),
//     query('after').default(getDateYesterday()).isDate(),
//     query('before').default('3000-12-31').isDate(),
//     query('envelope').optional().isArray(),
//     //TODO: validation for integer values
//   ]
// }
function placeQueryValidation() {
  return [
    query('envelope')
      .optional()
      .custom((values) => {
        const cords = values.split(',')
        if (cords.length !== 4) {
          throw new Error('Invalid number of coordinates')
        }
        if (
          Math.min(cords[0], cords[2]) < -90 ||
          Math.max(cords[0], cords[2]) > 90
        ) {
          throw new Error(
            'Latitude value cannot be greater than 90 or less than -90'
          )
        }
        if (
          Math.min(cords[1], cords[3]) < -180 ||
          Math.max(cords[1], cords[3]) > 180
        ) {
          throw new Error(
            'Longitude value cannot be greater than 180 or less than -180'
          )
        }
        return true
      }),
  ]
}
//return yesterdays date as yyyy-mm-dd

module.exports = {
  placeQueryValidation,
  errorHandler,
  userFromToken,
  sessionFrom,
}
