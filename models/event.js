const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Event extends Model {}

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
      type: DataTypes.TEXT,
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
      type: DataTypes.TEXT,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    posted_on: {
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
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: 'event',
  }
)

module.exports = Event