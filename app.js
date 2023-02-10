const express = require('express')
const app = express()
require('express-async-errors')

const { errorHandler } = require('./util/middleware')

const eventsRouter = require('./controllers/events')

app.use(express.json())
app.use('/api/events', eventsRouter)

app.use(errorHandler)

app.get('/', async (req, res) => {
  // const all = await Event.findAll()
  res.status(200).json('This is the api for the app jamit')
})

module.exports = app
