/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { User, Session, Event } = require('../models/index')

const api = supertest(app)

const user = {
  id: 999999999,
  username: 'testuser@hotmail.com',
  password: 'secretPassword',
}

describe('/api/me', () => {
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
    await api.post('/api/users').send({ ...user })
  })

  describe('GET', () => {
    test('Should return user information', async () => {
      const userLogin = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })

      const userDetails = await api
        .get('/api/me')
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(userDetails.body.username).toEqual(user.username)
      expect(userDetails.body.disabled).toEqual(false)
      expect(userDetails.body.roles).toContain('user')
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
