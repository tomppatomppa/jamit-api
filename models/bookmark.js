const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Bookmark extends Model {}

Bookmark.init(
  {
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
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },

  {
    sequelize,
    timestamps: true,
    modelName: 'bookmark',
  }
)

module.exports = Bookmark
