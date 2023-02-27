const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('events', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      shares: {
        type: DataTypes.INTEGER,
      },
      reactions: {
        type: DataTypes.JSON,
        defaultValue: 0,
      },
      reaction_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      comments: {
        type: DataTypes.INTEGER,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      posted_on: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      video: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      image: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      post_url: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      location: {
        type: DataTypes.GEOMETRY('POINT', 4326),
      },
    })
    await queryInterface.createTable('users', {
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
    })
    await queryInterface.createTable('sessions', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('events')
    await queryInterface.dropTable('sessions')
    await queryInterface.dropTable('users')
  },
}
