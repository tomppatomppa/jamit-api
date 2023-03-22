/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const request = supertest

describe('GET /api/bookmarks', () => {
  test('return status 401 unauthorized', async () => {
    await request(app).get('/api/bookmarks').expect(401)
  })
})
