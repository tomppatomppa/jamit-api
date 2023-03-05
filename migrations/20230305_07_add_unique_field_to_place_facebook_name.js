const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('places', 'facebook_profile', {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('places', 'facebook_profile', {
      type: DataTypes.TEXT,
      unique: false,
      allowNull: true,
    })
  },
}
