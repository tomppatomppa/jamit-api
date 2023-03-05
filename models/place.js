const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Place extends Model {}

Place.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    facebook_profile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.GEOMETRY('POINT', 4326),
    },
  },
  {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'place',
  }
)

module.exports = Place
