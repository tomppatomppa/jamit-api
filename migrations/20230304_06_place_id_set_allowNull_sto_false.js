const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('events', 'place_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('events', 'place_id', {
      type: DataTypes.INTEGER,
      allowNull: true,
    })
  },
}
