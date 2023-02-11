const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')
//const PROTECTED_ATTRIBUTES = ['passwordHash']

class User extends Model {
  // toJSON() {
  //   // hide protected fields
  //   let attributes = Object.assign({}, this.get())
  //   for (let a of PROTECTED_ATTRIBUTES) {
  //     delete attributes[a]
  //   }
  //   return attributes
  // }
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
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      // get() {
      //   return undefined
      // },
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
