const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('events', 'start_date', {
      type: DataTypes.DATE,
      allowNull: false,
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('events', 'start_date')
  },
}
