/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const { Event } = require('../models/index')
const api = supertest(app)
const data = require('../util/data.json')
const invalid_data = require('../util/data/invalidEvent.json')

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

describe('POST /api/events', () => {
  beforeAll(async () => {
    await Event.destroy({
      name: 'Muusikkojen liitto',
      where: {
        post_url: data.post_url,
      },
    })
  })
  describe('test post endpoint functionality', () => {
    test('endpoint returns the created event', async () => {
      const event = await api.post('/api/events').send(data)
      // eslint-disable-next-line no-unused-vars
      const { posted_on, updatedAt, createdAt, ...rest } = data //remove updatedAt from body,
      expect(event.body).toEqual(
        expect.objectContaining({
          ...rest,
        })
      )
    })
    test('post request is missing mandatory NAME field', async () => {
      const event = await api.post('/api/events').send(invalid_data[0])
      expect(event.body.error).toBeDefined()
      expect(event.body).toEqual({ error: ['event.name cannot be null'] })
    })
    test('post request is missing mandatory CONTENT field', async () => {
      const event = await api.post('/api/events').send(invalid_data[1])
      expect(event.body.error).toBeDefined()
      expect(event.body).toEqual({ error: ['event.content cannot be null'] })
    })
    test('post request is missing mandatory POSTED_ON field', async () => {
      const event = await api.post('/api/events').send(invalid_data[2])
      expect(event.body.error).toBeDefined()
      expect(event.body).toEqual({ error: ['event.posted_on cannot be null'] })
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
