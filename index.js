const { connectToDatabase } = require('./util/db')

const app = require('./app')
const { PORT } = require('./util/config')

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
