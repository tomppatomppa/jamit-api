const Event = require('./event')
const User = require('./user')
const Session = require('./session')

// User.sync()
// Event.sync()
// Session.sync()

User.hasMany(Event)
Event.belongsTo(User)

User.hasMany(Session)
Session.belongsTo(User)

module.exports = {
  Event,
  User,
  Session,
}
