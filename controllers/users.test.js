/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { User } = require('../models/index')

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
    test('Creating a user with fields as empty strings', async () => {
      const user = await api
        .post('/api/users')
        .send({ username: '', password: '' })
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

describe('DELETE /api/users', () => {
  beforeAll(async () => {
    await User.destroy({
      where: {
        username: validUser.username,
      },
    })
  })

  describe('deleting users', () => {
    test('deleting user with valid token', async () => {
      await api.post('/api/users').send(validUser)
      const userLogin = await api.post('/api/login').send(validUser)
      // expect(userLogin.body).toEqual({ //TODO: username not returned with token
      //   token: 'something',
      //   username: validUser.username,
      // })
      const result = await api
        .delete(`/api/users`)
        .send({ username: validUser.username })
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body).toEqual('Succesfully deleted user')
    })
    test('deleting user who is not the owner of the username', async () => {
      await api.post('/api/users').send(validUser)
      const userLogin = await api.post('/api/login').send(validUser)

      const result = await api
        .delete(`/api/users`)
        .send({ username: 'notMyUsername@hotmail.com' })
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body.error).toEqual('No permission to delete this user')
    })
    test('user sends invalid token', async () => {
      await api.post('/api/users').send(validUser)

      const result = await api
        .delete(`/api/users`)
        .send({ username: validUser.username })
        .set('Authorization', `Bearer ${'1234'}`)

      expect(result.body.error).toEqual('no valid session')
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
