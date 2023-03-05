const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Place extends Model {
  toJSON() {
    let attributes = Object.assign({}, this.get())
    if (attributes.location.crs) {
      delete attributes.location.crs
    }
    return attributes
  }
}

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
