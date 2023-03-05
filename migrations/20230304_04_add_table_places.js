const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('places', {
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
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('places')
  },
}
