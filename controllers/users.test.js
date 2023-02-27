/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { User, Event, Session } = require('../models/index')

const api = supertest(app)

const invalidUsers = [
  {
    username: 'invaliduserwithoutpassword@hotmail.com',
  },
  {
    password: 'nousername',
  },
  {
    username: 'invaliduserTooShortPassword@hotmail.com',
    password: 'short',
  },
]

const user = {
  id: 999999999,
  username: 'testuser@hotmail.com',
  password: 'secretPassword',
}

describe('POST /api/users', () => {
  beforeAll(async () => {
    await Event.destroy({
      where: { user_id: user.id },
    })
    await Session.destroy({
      where: { user_id: user.id },
    })
    await User.destroy({
      where: { id: user.id },
    })
  })

  describe('Creating new user', () => {
    test('returns correct username', async () => {
      const loggedUser = await api.post('/api/users').send({ ...user })
      expect(loggedUser.body.username).toEqual('testuser@hotmail.com')
    })
    test('Creating a user without password', async () => {
      const user = await api.post('/api/users').send(invalidUsers[0])
      expect(user.body.error).toEqual('Username or Password missing')
    })
    test('Creating a user with too short password', async () => {
      const user = await api.post('/api/users').send(invalidUsers[2])
      expect(user.body.error).toEqual('Password must be at least 8 characters')
    })
    test('Creating a user without username', async () => {
      const user = await api.post('/api/users').send(invalidUsers[1])
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
      await api.post('/api/users').send({ ...user })

      const duplicateUser = await api
        .post('/api/users')
        .send({ username: user.username, password: user.password })
      expect(duplicateUser.body.error[0]).toEqual('username must be unique')
    })
  })

  afterAll(async () => {
    await Event.destroy({
      where: { user_id: user.id },
    })
    await Session.destroy({
      where: { user_id: user.id },
    })
    await User.destroy({
      where: { id: user.id },
    })
  })
})

describe('DELETE /api/users', () => {
  beforeAll(async () => {
    await Event.destroy({
      where: { user_id: user.id },
    })
    await Session.destroy({
      where: { user_id: user.id },
    })
    await User.destroy({
      where: { id: user.id },
    })
  })
  describe('deleting users', () => {
    test('deleting user with valid token', async () => {
      await api.post('/api/users').send({ ...user })
      const userLogin = await api.post('/api/login').send({ ...user })

      const result = await api
        .delete(`/api/users`)
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body).toEqual('Succesfully deleted user')
    })

    test('user sends invalid token', async () => {
      await api.post('/api/users').send({ ...user })
      const result = await api
        .delete(`/api/users`)
        .send({ username: user.username })
        .set('Authorization', `Bearer ${'1234'}`)
      expect(result.body.error).toEqual('no valid session')
    })
  })
  afterAll(async () => {
    await Event.destroy({
      where: { user_id: user.id },
    })
    await Session.destroy({
      where: { user_id: user.id },
    })
    await User.destroy({
      where: { id: user.id },
    })
  })
})
