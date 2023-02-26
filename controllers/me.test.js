/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { User } = require('../models/index')

const api = supertest(app)

const user = { username: 'testuser@hotmail.com', password: 'secretPassword' }

describe('/api/me', () => {
  beforeAll(async () => {
    await api.post('/api/users').send(user)
  })
  afterAll(async () => {
    await User.destroy({
      where: {
        username: user.username,
      },
    })
  })
  describe('GET', () => {
    test('Should return user information', async () => {
      const userLogin = await api.post('/api/login').send(user)
      const userDetails = await api
        .get('/api/me')
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(userDetails.body.username).toEqual(user.username)
      expect(userDetails.body.disabled).toEqual(false)
      expect(userDetails.body.roles).toContain('user')
    })
  })
})
