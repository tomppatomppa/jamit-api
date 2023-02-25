const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Event extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get())
    if (attributes.location.crs) {
      delete attributes.location.crs
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
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
