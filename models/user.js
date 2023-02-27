const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class User extends Model {
  toJSON() {
    // exclude passwordHash by default
    let attributes = Object.assign({}, this.get())
    delete attributes.password_hash
    return attributes
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: ['user'],
      allowNull: false,
    },
  },

  {
    sequelize,
    underscored: true,
    timestamps: true,
    updatedAt: true,
    modelName: 'user',
  }
)

module.exports = User
