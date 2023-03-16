const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('bookmarks', {
      bookmark_reference: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      table_reference: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      item_reference: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bookmark_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('bookmarks')
  },
}
