const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('bookmarks', 'createdAt', {
      type: DataTypes.DATE,
      allowNull: false,
    })
    await queryInterface.addColumn('bookmarks', 'updatedAt', {
      type: DataTypes.DATE,
      allowNull: false,
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('bookmarks', 'createdAt')
    await queryInterface.removeColumn('bookmarks', 'updatedAt')
  },
}
