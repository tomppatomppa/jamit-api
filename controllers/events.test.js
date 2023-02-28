/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { Event, User, Session } = require('../models/index')
const api = supertest(app)

const user = {
  id: 999999999,
  username: 'testuser@hotmail.com',
  password: 'secretPassword',
}

const event = {
  id: 888888888,
  name: 'TEST EVENT',
  shares: 0,
  reactions: {
    likes: 1,
    loves: 0,
    wow: 0,
    cares: 0,
    sad: 0,
    angry: 0,
    haha: 0,
  },
  reaction_count: 1,
  comments: 0,
  content:
    'Tulevan maanantain Join the houseband! -jameissa G Livelab Helsinkissä opiskelijat ja ammattilaiset kohtaavat – ota siis soittimesi mukaan ja tule jammailemaan!House bandissa soittavat Stina Koistinen (laulu), Amanda Blomqvist (rummut ja perkussiot), Juho Kanervo (sello ja basso) ja Markus Pajakkala (puhaltimet, perkussiot, kosketinsoittimet).Soittajien käytössä ovat klubin flyygeli ja rummut sekä mikrofoneja ja vahvistimia. Jameihin on maksuton sisäänpääsy.Jameja ennen klo 16.30 alkaen järjestetään musiikin opiskelijoille suunnattu opiskelijapäivä, jossa keskitytään työelämään liittyviin aiheisiin. Opiskelija, ilmoittaudu mukaan: https://www.muusikkojenliitto.fi/ilmoittaudu-mukaan.../Jamit järjestävät Muusikkojen liitto ja Freelancemuusikot ry.#Muusikkojenliitto #Äänenkannattaja',
  posted_on: '2023-01-20T21:16:59.486209',
  video: [],
  image: [
    'https://scontent.fqlf1-2.fna.fbcdn.net/v/t39.30808-6/323883945_3313335945572452_820931808253465925_n.jpg?stp=c0.7.526.275a_dst-jpg_p526x296&_nc_cat=110&ccb=1-7&_nc_sid=340051&_nc_ohc=Ut2DZWW1It0AX95Ucwh&_nc_ht=scontent.fqlf1-2.fna&oh=00_AfDXBsgdb2jayKLQIIqmrzQAOHazGntd_pntW5yvNqCujA&oe=63D241D7',
  ],
  post_url:
    'https://www.facebook.com/muusikkojenliitto/posts/pfbid0kdV9tyiPbr647HoWkZF81M1MteGprm7TAnjS7mFURhsUd4qicj1ef8XT7v4GEGdbl?__cft__[0]=AZXMR2qW5MENHQ0CVmImlnnMZ8EVm_gNxNyKfz6JgtP6ETAuOLedHDzI-i7FNNf4bdRp-j0GkdQnClyQKTRlqeY-tN-lSN1-VFS0P89rrIH309pgw26mX--baSuYJfsfJaHjhVNKsH0xbf3VUnxUA909BqN7wSmbIm4BT7wdJM8wDpkLBj4b6wfp0xDdQYPwTc73uIJoQEzH5x9_VvZjOynQ&__tn__=%2CO%2CP-R',
  location: {
    type: 'Point',
    coordinates: [60, 25],
  },
  start_date: '2023-03-02T21:16:59.486Z',
}

const baseQuery = {
  xmin: event.location.coordinates[0],
  ymin: event.location.coordinates[1],
  xmax: event.location.coordinates[0] + 0.00000001,
  ymax: event.location.coordinates[1] + 0.00000001,
}

describe('GET /api/events', () => {
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
    const password_hash = await bcrypt.hash(user.password, 10)
    const createdUser = await User.create({
      ...user,
      password_hash: password_hash,
    })
    await Event.create({ ...event, user_id: createdUser.id })
  })
  describe('all available query params for /api/events', () => {
    describe('baseQuery with just area defined', () => {
      test('query without spefifying an area should return 400', async () => {
        await api.get('/api/events').expect(400)
      })
      test('query without any one of xmin, ymin, xmax, ymax should cause an error', async () => {
        const response = await api.get('/api/events').expect(400)
        expect(response.body.errors).toBeDefined()
      })
    })

    describe('testing query parameter "after"  ', () => {
      test('invalid query param "after" returns 400 and error message', async () => {
        const response = await api
          .get('/api/events')
          .expect(400)
          .query({
            ...baseQuery,
            after: 'not-a-date',
          })
        expect(response.body.errors[0].msg).toEqual('Invalid value')
        expect(response.body.errors[0].param).toEqual('after')
      })
      test('empty query param "after"  should return 200', async () => {
        const response = await api
          .get('/api/events')
          .expect(200)
          .query({
            ...baseQuery,
            after: '', //Should default to current date yyyy-mm-dd
          })
      })
      test('query param "after" yyyy-mm-dd should return 200', async () => {
        await api
          .get('/api/events')
          .expect(200)
          .query({
            ...baseQuery,
            after: '2023-03-02',
          })
      })
    })
    //query params "before"
    describe('query param "before"', () => {
      test('invalid query param "before" returns 400 and error message', async () => {
        const response = await api
          .get('/api/events')
          .expect(400)
          .query({
            ...baseQuery,
            before: 'not-a-date',
          })
        expect(response.body.errors[0].msg).toEqual('Invalid value')
        expect(response.body.errors[0].param).toEqual('before')
      })
      test('empty query param "before" should return 200', async () => {
        await api
          .get('/api/events')
          .expect(200)
          .query({
            ...baseQuery,
            before: '', //should default 3000-12-31 if nothing is provided
          })
      })
      test('query param "before" yyyy-mm-dd should return 200', async () => {
        await api
          .get('/api/events')
          .expect(200)
          .query({
            ...baseQuery,
            before: '2023-03-02',
          })
      })
    })
    //query params "limit"
    describe('query param "limit"', () => {
      test('limit cannot be over integer over 200', async () => {
        const response = await api
          .get('/api/events')
          .expect(400)
          .query({
            ...baseQuery,
            limit: 201,
          })
        expect(response.body.errors[0].msg).toEqual(
          'limit cannot be greater than 200'
        )
        expect(response.body.errors[0].param).toEqual('limit')
      })
      test('limit set to 0 should throw an error', async () => {
        const response = await api
          .get('/api/events')
          .expect(400)
          .query({
            ...baseQuery,
            limit: 0,
          })
        expect(response.body.errors[0].msg).toEqual(
          'limit cannot be less than 1'
        )
      })
    })
    describe('returns correct format and event', () => {
      test('response should be an array', async () => {
        const response = await api
          .get('/api/events')
          .expect(200)
          .query({
            ...baseQuery,
          })
        expect(response.body).toBeInstanceOf(Array)
      })

      test('test data exists in array', async () => {
        const response = await api.get('/api/events').query({
          ...baseQuery,
        })
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              id: event.id,
              post_url: event.post_url,
            }),
          ])
        )
      })

      test('test endpoint for fetching a single event', async () => {
        const response = await api.get(`/api/events/${event.id}`)
        expect(response.body.id).toEqual(event.id)
        expect(response.body.content).toEqual(event.content)
      })
    })
  })
  //Returns something

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
describe('POST /api/events', () => {
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
    const password_hash = await bcrypt.hash(user.password, 10)
    await User.create({
      ...user,
      password_hash: password_hash,
    })
  })
  describe('Adding new event', () => {
    test('endpoint returns the created event', async () => {
      const userLogin = await api.post('/api/login').send(user)

      const result = await api
        .post(`/api/events`)
        .send(event)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      // eslint-disable-next-line no-unused-vars
      const { updatedAt, createdAt, user_id, ...eventWithoutTimestamps } =
        result.body
      expect(eventWithoutTimestamps).toEqual(
        expect.objectContaining({
          ...event,
        })
      )
    })
    test('created event with duplicate url', async () => {
      const userLogin = await api.post('/api/login').send(user)

      const result = await api
        .post(`/api/events`)
        .send({ ...event, id: 77777777 })
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(result.body.error).toEqual(['post_url must be unique'])
    })
    test('post request is missing mandatory NAME field', async () => {
      const userLogin = await api.post('/api/login').send(user)
      const { name, ...eventWithoutNameField } = event
      const result = await api
        .post(`/api/events`)
        .send(eventWithoutNameField)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(result.body.error).toEqual(['event.name cannot be null'])
    })
    test('post request is missing mandatory CONTENT field', async () => {
      const userLogin = await api.post('/api/login').send(user)
      const { content, ...eventWithoutContentField } = event
      const result = await api
        .post(`/api/events`)
        .send(eventWithoutContentField)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(result.body.error).toEqual(['event.content cannot be null'])
    })
    test('post request is missing mandatory POSTED_ON field', async () => {
      const userLogin = await api.post('/api/login').send(user)
      const { posted_on, ...eventWithoutPostedOnField } = event
      const result = await api
        .post(`/api/events`)
        .send(eventWithoutPostedOnField)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(result.body.error).toEqual(['event.posted_on cannot be null'])
    })
    test('post request is missing mandatory START_DATE field', async () => {
      const userLogin = await api.post('/api/login').send(user)
      const { start_date, ...eventWithoutPostedOnField } = event
      const result = await api
        .post(`/api/events`)
        .send(eventWithoutPostedOnField)
        .set('Authorization', `Bearer ${userLogin.body.token}`)
      expect(result.body.error).toEqual(['event.start_date cannot be null'])
    })

    describe('add events with 10 m distance of each other', () => {
      let dummyData = []
      beforeAll(async () => {
        await Event.destroy({
          where: {
            user_id: user.id,
          },
        })

        const userLogin = await api.post('/api/login').send(user)
        const latitude = 74.45132200544495
        const meters = 10
        // create 10 dummy objects
        for (let i = 0; i < 10; i++) {
          const new_latitude = latitude + (meters * i + 1) / 111111 //Each degree of latitude equals roughly 111111 meters
          const location = {
            type: 'Point',
            coordinates: [new_latitude, 19.027280232194727],
          }
          const result = await api
            .post(`/api/events`)
            .send({
              ...event,
              post_url: `url${i}`,
              location: location,
              id: event.id + i,
            })
            .set('Authorization', `Bearer ${userLogin.body.token}`)
          dummyData.push(result.body)
        }
      })
      test('expect api to return all added events inside the rectangle', async () => {
        const result = await api.get('/api/events').query({
          xmin: 74.35626502890085,
          ymin: 18.73108873282493,
          xmax: 74.52482596141493,
          ymax: 19.31813494285226,
        })
        expect(result.body.length).toEqual(10)
      })
      test('Expect event id to be exluded from query', async () => {
        const result = await api.get('/api/events').query({
          xmin: 74.35626502890085,
          ymin: 18.73108873282493,
          xmax: 74.52482596141493,
          ymax: 19.31813494285226,
          excludedIds: [dummyData[0].id],
        })
        expect(result.body.length).toEqual(9)
      })
      test('expect api to not find any events inside the rectangle', async () => {
        const result = await api.get('/api/events').query({
          xmin: 74.23025396628665,
          ymin: 18.686767959396114,
          xmax: 74.33722591053454,
          ymax: 19.290361229480073,
        })
        expect(result.body.length).toEqual(0)
      })
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
