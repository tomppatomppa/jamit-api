/* eslint-disable no-undef */
const request = require('supertest')
const supertest = require('supertest')
const app = require('../app')

const { User, Session } = require('../models/index')
const api = supertest(app)

const user = {
  id: 999999999,
  username: 'testuser@hotmail.com',
  password: 'secretPassword',
}

describe('POST api/reset', () => {
  beforeAll(async () => {
    await Session.destroy({
      where: {
        user_id: user.id,
      },
    })
    await User.destroy({
      where: { id: user.id },
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
  describe('If username does not exist', () => {
    test("provided username doesn't exist in the database", async () => {
      const response = await api.post('/api/reset').send(user)
      expect(response.body.error).toEqual('User does not exist')
    })
  })
})
