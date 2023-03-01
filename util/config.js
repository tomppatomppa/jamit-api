require('dotenv').config()

module.exports = {
  DATABASE_URL:
    process.env.NODE_ENV === 'test'
      ? process.env.DATABASE_URL_TEST
      : process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
  SECRET: process.env.SECRET,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  SENDER: process.env.SENDER,
  SENDER_PASSWORD: process.env.SENDER_PASSWORD,
}
