import express from 'express'

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const app = express()

app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})

app.listen(process.env.PORT, () => console.log(process.env.PORT))

export default app
