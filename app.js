const express = require('express')
const app = express()
require('express-async-errors')

const { errorHandler } = require('./util/middleware')

const eventsRouter = require('./controllers/events')
const loginRouter = require('./controllers/login')
const userRouter = require('./controllers/users')

app.use(express.json())

app.use('/api/events', eventsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', userRouter)
app.use(errorHandler)

app.get('/', async (req, res) => {
  res.status(200).json('This is the api for the app jamit')
})

module.exports = app
