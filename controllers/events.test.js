/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { Event, User } = require('../models/index')
const api = supertest(app)
const data = require('../util/data.json')
const { invalidEvent, validUser } = require('../__tests__/data/index')

describe('GET /api/events', () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(validUser.password, 10)
    await User.create({
      username: validUser.username,
      passwordHash: passwordHash,
    })
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
    await User.destroy({ where: { username: 'testuser@hotmail.com' } })
  })
})

// describe('POST /api/events', () => {
//   beforeAll(async () => {
//     await Event.destroy({
//       name: 'Muusikkojen liitto',
//       where: {
//         post_url: data.post_url,
//       },
//     })
//   })
//   describe('Adding new event', () => {
//     test('endpoint returns the created event', async () => {
//       const event = await api.post('/api/events').send(data)
//       // eslint-disable-next-line no-unused-vars
//       const { updatedAt, createdAt, ...eventWithoutTimestamps } = event.body
//       expect(eventWithoutTimestamps).toEqual(
//         expect.objectContaining({
//           ...data,
//         })
//       )
//     })
//     test('post request is missing mandatory NAME field', async () => {
//       const event = await api.post('/api/events').send(invalidEvent[0])

//       expect(event.body).toEqual({ error: ['event.name cannot be null'] })
//     })
//     test('post request is missing mandatory CONTENT field', async () => {
//       const event = await api.post('/api/events').send(invalidEvent[1])

//       expect(event.body).toEqual({ error: ['event.content cannot be null'] })
//     })
//     test('post request is missing mandatory POSTED_ON field', async () => {
//       const event = await api.post('/api/events').send(invalidEvent[2])

//       expect(event.body).toEqual({ error: ['event.posted_on cannot be null'] })
//     })

//     test('Adding an post that has the same post_url field', async () => {
//       await api.post('/api/events').send(data)
//       const eventWithDuplicateUrl = await api
//         .post('/api/events')
//         .send({ ...data, id: 8888 })

//       expect(eventWithDuplicateUrl.body).toEqual({
//         error: ['post_url must be unique'],
//       })
//     })
//   })

//   afterAll(async () => {
//     await Event.destroy({
//       name: 'Muusikkojen liitto',
//       where: {
//         post_url: data.post_url, /////
//       },
//     })
//     await User.destroy({ where: { username: 'testuser@hotmail.com' } })
//   })
// })
