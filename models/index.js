const Event = require('./event')
const User = require('./user')
const Session = require('./session')

User.hasMany(Event)
Event.belongsTo(User)

User.hasMany(Session, { onDelete: 'cascade', hooks: true })

Session.belongsTo(User)

module.exports = {
  Event,
  User,
  Session,
}
