const express = require('express')
const app = express()

const { connectToDatabase } = require('./util/db')

const { PORT } = require('./util/config')
const { Event } = require('./models/index')

app.use(express.json())
app.get('/', async (req, res) => {
  const all = await Event.findAll()

  res.status(200).send(all)
})

app.post('/', async (req, res) => {
  try {
    const createdEvent = await Event.create(req.body)
    res.json(createdEvent)
  } catch (e) {
    res.json(e)
  }
})
const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
