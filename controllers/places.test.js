/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')

const request = supertest

describe('Places endpoints', () => {
  describe('GET /api/places without query params', () => {
    test('Request with no query params should return 200', async () => {
      await request(app).get('/api/places').expect(200)
    })
    test('Response should be of type Array', async () => {
      const { body } = await request(app).get('/api/places')
      expect(body).toBeInstanceOf(Array)
    })
  })

  describe('GET /api/places with query param <after>', () => {
    test('Invalid date param <after>', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ after: 'not-a-date' })
      expect(body.errors[0].msg).toEqual('Invalid value')
      expect(body.errors[0].param).toEqual('after')
    })
    test('Invalid date format <after>', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ after: '02-03-2023' })
      expect(body.errors[0].msg).toEqual('Invalid value')
      expect(body.errors[0].param).toEqual('after')
    })
    test('Valid ISO date format <after>', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ after: '2023-03-03' })
      expect(body.errors).not.toBeDefined()
    })
    test('Empty after query defaults to yesterdays date', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ after: '' })
      expect(body.errors).not.toBeDefined()
    })
    test('Empty after query defaults to yesterdays date', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ after: '' })
      expect(body.errors).not.toBeDefined()
    })
  })
  describe('GET /api/places with query param <evnelope>', () => {
    test('Empty string', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ envelope: '' })
      expect(body.errors[0].msg).toEqual('Invalid number of coordinates')
      expect(body.errors[0].param).toEqual('envelope')
    })
    test('Invalid number of coordinates', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ envelope: '90,90,90' })
      expect(body.errors[0].msg).toEqual('Invalid number of coordinates')
      expect(body.errors[0].param).toEqual('envelope')
    })
    test('Invalid latitude value', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ envelope: '91,180,90,180' })
      expect(body.errors[0].msg).toEqual(
        'Latitude value cannot be greater than 90 or less than -90'
      )
    })
    test('Invalid longitude value', async () => {
      const { body } = await request(app)
        .get('/api/places')
        .query({ envelope: '90,181,90,180' })
      expect(body.errors[0].msg).toEqual(
        'Longitude value cannot be greater than 180 or less than -180'
      )
    })
  })
})
