/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const request = supertest

describe('Events endpoint', () => {
  describe('GET /api/events without query params', () => {
    test('Request with no query params should return 200', async () => {
      await request(app).get('/api/events').expect(200)
    })
    test('Response rows should be of type Array', async () => {
      const { body } = await request(app).get('/api/events')
      expect(body.rows).toBeInstanceOf(Array)
    })
    test('Response should contain count field', async () => {
      const { body } = await request(app).get('/api/events')
      expect(body.count).toBeDefined()
    })
  })
  describe('GET /api/events limit query param', () => {
    test('Request with limit < 1 should throw error', async () => {
      const { body } = await request(app).get('/api/events').query({ limit: 0 })
      expect(body.errors[0].msg).toEqual('Invalid value')
    })
    test('Request with limit > 50 should throw error', async () => {
      const { body } = await request(app).get('/api/events').query({ limit: 0 })
      expect(body.errors[0].msg).toEqual('Invalid value')
    })
    test('Limit is not an Int ', async () => {
      const { body } = await request(app)
        .get('/api/events')
        .query({ limit: 'NotAnInt' })
      expect(body.errors[0].msg).toEqual('Invalid value')
    })
    test('Request with limit <= 50 limit >= 1 should not throw error', async () => {
      const { body } = await request(app).get('/api/events').query({ limit: 5 })
      expect(body.errors).not.toBeDefined()
    })
    test('No limit query params should not cause an error', async () => {
      const { body } = await request(app).get('/api/events').query()
      expect(body.errors).not.toBeDefined()
    })
  })
  describe('GET /api/events offset query param', () => {
    test('Request with invalid value for offset', async () => {
      const { body } = await request(app)
        .get('/api/events')
        .query({ offset: 'NotAnInt' })
      expect(body.errors[0].msg).toEqual('Invalid value')
    })
    test('Request with empty offset should use default value', async () => {
      const { body } = await request(app).get('/api/events').query()
      expect(body.errors).not.toBeDefined()
    })
  })
})
