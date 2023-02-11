const Event = require('./event')
const User = require('./user')
Event.sync()
User.sync()
module.exports = {
  Event,
  User,
}
