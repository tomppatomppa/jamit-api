/* eslint-disable no-undef */
const request = require('supertest')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { User } = require('../models')
const api = supertest(app)

const user = {
  username: 'testuser@hotmail.com',
  password: 'secretPassword',
}

describe('POST api/reset', () => {
  beforeAll(async () => {
    await User.destroy({
      where: {
        username: user.username,
      },
    })
  })
  describe('NO username', () => {
    test('should return 400 status code ', async () => {
      const response = await request(app).post('/api/reset').send({
        username: '',
      })
      expect(response.status).toBe(400)
    })
  })

  describe('If username doesnt exist throw error', () => {
    test("provided username doesn't exist in the database", async () => {
      const response = await api.post('/api/reset').send(user)
      expect(response.body).toEqual('User does not exist')
    })
  })

  describe('If username exists', () => {
    beforeAll(async () => {
      const password_hash = await bcrypt.hash(user.password, 10)
      await User.create({
        ...user,
        password_hash: password_hash,
      })
    })
    afterAll(async () => {
      await User.destroy({
        where: {
          username: user.username,
        },
      })
    })
    test('provided username exists in the database', async () => {
      const response = await api.post('/api/reset').send(user)
      expect(response.body).toEqual(
        'Instructions to reset your password has been sent to your email'
      )
    })
  })
})
