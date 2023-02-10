/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { Event } = require('../models/index')
const api = supertest(app)
const data = require('../util/data.json')

describe('GET /api/events', () => {
  beforeAll(async () => {
    await Event.destroy({
      name: 'Muusikkojen liitto',
      where: {
        post_url: data.post_url,
      },
    })
    await Event.create(data) //Created event from test data
  })

  describe('correct return type and data', () => {
    test('response should be an array', async () => {
      const response = await api.get('/api/events').expect(200)
      expect(response.body).toBeInstanceOf(Array)
    })
    test('test data exists in array', async () => {
      const response = await api.get('/api/events').expect(200)
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            post_url: data.post_url, //post_url are unique
          }),
        ])
      )
    })
    test('test endpoint for fetching a single event', async () => {
      const response = await api.get(`/api/events/999999`) //Test data id is 999999
      expect(response.body).toEqual(
        expect.objectContaining({
          post_url: data.post_url, //post_url are unique
        })
      )
    })
  })

  afterAll(async () => {
    await Event.destroy({
      name: 'Muusikkojen liitto',
      where: {
        post_url: data.post_url,
      },
    })
  })
})
