/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { User } = require('../models/index')
const { describe } = require('../models/session')
const api = supertest(app)

const { validUser, invalidUser } = require('../__tests__/data/index')

describe('POST /api/users', () => {
  beforeAll(async () => {
    await User.destroy({
      where: {
        username: validUser.username,
      },
    })
  })
  describe('Creating new user', () => {
    test('returns correct username', async () => {
      const user = await api.post('/api/users').send(validUser)
      expect(user.body.username).toEqual('testuser@hotmail.com')
    })
    test('Creating a user without password', async () => {
      const user = await api.post('/api/users').send(invalidUser[0])
      expect(user.body.error).toEqual('Username or Password missing')
    })
    test('Creating a user without username', async () => {
      const user = await api.post('/api/users').send(invalidUser[1])
      expect(user.body.error).toEqual('Username or Password missing')
    })
    test('Creating a user with empty body', async () => {
      const user = await api.post('/api/users').send({})
      expect(user.body.error).toEqual('Username or Password missing')
    })
    test('Create user that already exists', async () => {
      await api.post('/api/users').send(validUser)
      const duplicateUser = await api.post('/api/users').send(validUser)
      expect(duplicateUser.body.error[0]).toEqual('username must be unique')
    })
  })

  afterAll(async () => {
    await User.destroy({
      where: {
        username: validUser.username,
      },
    })
  })
})
describe('DELETE /api/users', async () => {
  beforeAll(async () => {
    await User.destroy({
      where: {
        username: validUser.username,
      },
    })
    await api.post('/api/users').send(validUser)
  })

  const user = await api.post('/api/login').send(validUser)
  describe('deleting users', () => {
    test('deleting user with valid token', async () => {
      const result = await api.delete('/api/users').send()
    })
  })

  afterAll(async () => {
    await User.destroy({
      where: {
        username: validUser.username,
      },
    })
  })
})
