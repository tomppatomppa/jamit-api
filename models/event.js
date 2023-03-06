const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Event extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get())
    if (attributes.location.crs) {
      delete attributes.userId //TODO: deal with postgress creating these
      delete attributes.user_id
      delete attributes.placeId

      delete attributes.location
    }
    return attributes
  }
}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shares: {
      type: DataTypes.INTEGER,
    },
    reactions: {
      type: DataTypes.JSON,
      defaultValue: 0,
    },
    reaction_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    comments: {
      type: DataTypes.INTEGER,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    posted_on: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    video: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    image: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
    },
    post_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    place_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'places', key: 'id' },
    },
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'event',
  }
)

module.exports = Event
