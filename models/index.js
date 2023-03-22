const Event = require('./event')
const User = require('./user')
const Session = require('./session')
const Place = require('./place')
const Bookmark = require('./bookmark')

User.hasMany(Event)
User.hasMany(Bookmark, { foreignKey: 'user_id' })
Bookmark.belongsTo(User, { foreignKey: 'user_id' })
Bookmark.belongsTo(Event, {
  foreignKey: 'item_reference',
  constraints: false,
  as: 'events',
})

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
  Bookmark,
}
