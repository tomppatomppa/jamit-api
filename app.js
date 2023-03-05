const express = require('express')
const app = express()
require('express-async-errors')

const { errorHandler, userFromToken } = require('./util/middleware')

const eventsRouter = require('./controllers/events')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')
const meRouter = require('./controllers/me')
const resetRouter = require('./controllers/reset')
const placeRouter = require('./controllers/places')

app.use(express.json())

app.use('/api/events', eventsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use('/api/reset', resetRouter)
app.use('/api/places', placeRouter)

app.get('/', async (req, res) => {
  res.status(200).json('This is the api for the app jamit')
})

app.use(userFromToken)
app.use('/api/me', meRouter)
app.use(errorHandler)

module.exports = app
