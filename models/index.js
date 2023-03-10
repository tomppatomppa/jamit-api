const Event = require('./event')
const User = require('./user')
const Session = require('./session')
const Place = require('./place')

User.hasMany(Event)
Event.belongsTo(User)

Event.belongsTo(Place)
Place.hasMany(Event, { as: 'data' })

User.hasMany(Session, { onDelete: 'cascade', hooks: true })

Session.belongsTo(User)

module.exports = {
  Event,
  User,
  Session,
  Place,
}
