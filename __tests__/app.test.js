/* eslint-disable no-undef */
const supertest = require('supertest')

const app = require('../app')
const api = supertest(app)

describe('GET /', () => {
  describe('Test return values of GET request', () => {
    test('should respond with status code 200 and JSON format', async () => {
      await api
        .get('/')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
    test('Should have the correct message', async () => {
      const response = await api.get('/')
      expect(response.body).toBe('This is the api for the app jamit')
    })
  })
})
