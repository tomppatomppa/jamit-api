const express = require('express')
const app = express()
const { Event } = require('./models/index')

const eventsRouter = require('./controllers/events')

app.use(express.json())
app.use('/api/events', eventsRouter)
app.get('/', async (req, res) => {
  // const all = await Event.findAll()
  res.status(200).json('This is the api for the app jamit')
})

app.post('/', async (req, res) => {
  try {
    const createdEvent = await Event.create(req.body)
    res.json(createdEvent)
  } catch (e) {
    res.json(e)
  }
})

module.exports = app
