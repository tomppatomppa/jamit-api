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
  describe('If username doesnt exist throw error', () => {
    test("provided username doesn't exist in the database", async () => {
      const response = await api.post('/api/reset').send(user)
      expect(response.body).toEqual('User does not exist')
    })
  })

  // describe('If username exists', () => {
  //   beforeAll(async () => {
  //     await User.destroy({
  //       where: {
  //         id: user.id,
  //       },
  //     })
  //     const password_hash = await bcrypt.hash(user.password, 10)
  //     const createdUser = await User.create({
  //       ...user,
  //       password_hash: password_hash,
  //     })
  //   })
  //   describe('resetting password', () => {
  //     test('provided username exists in the database', async () => {
  //       const response = await api
  //         .post('/api/reset')
  //         .send({ username: user.username })
  //       // expect(response).toEqual(
  //       //   `Recovery instructions sent to ${user.username}.
  //       //     Remember to check you junk folder!`
  //       // )
  //       expect(response).toEqual({})
  //     })
  //   })
  //   afterAll(async () => {
  //     await User.destroy({
  //       where: { id: user.id },
  //     })
  //   })
  // })
})
