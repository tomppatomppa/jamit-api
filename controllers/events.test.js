/* eslint-disable no-undef */
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const { Event, User } = require('../models/index')
const api = supertest(app)
const data = require('../util/data.json')
const { invalidEvent, validUser } = require('../__tests__/data/index')

const CreateEvents = [
  {
    name: 'Muusikkojen liitto',
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
  },
]
describe('GET /api/events', () => {
  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(validUser.password, 10)
    const createdUser = await User.create({
      username: validUser.username,
      passwordHash: passwordHash,
    })
    await Event.destroy({
      name: 'Muusikkojen liitto',
      where: {
        post_url: data.post_url,
      },
    })
    await Event.create({ ...data, userId: createdUser.id }) //Created event from test data
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

describe('POST /api/events', () => {
  beforeAll(async () => {
    await Event.destroy({
      name: 'Muusikkojen liitto',
      where: {
        post_url: data.post_url,
      },
    })
    const passwordHash = await bcrypt.hash(validUser.password, 10)
    await User.create({
      username: validUser.username,
      passwordHash: passwordHash,
    })
  })
  describe('Adding new event', () => {
    test('endpoint returns the created event', async () => {
      const userLogin = await api.post('/api/login').send(validUser)
      const result = await api
        .post(`/api/events`)
        .send(data)
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      // eslint-disable-next-line no-unused-vars
      const { updatedAt, createdAt, userId, ...eventWithoutTimestamps } =
        result.body
      expect(eventWithoutTimestamps).toEqual(
        expect.objectContaining({
          ...data,
        })
      )
    })
    test('created event with duplicate id', async () => {
      const userLogin = await api.post('/api/login').send(validUser)
      const result = await api
        .post(`/api/events`)
        .send(data)
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body.error).toEqual(['id must be unique'])

      // eslint-disable-next-line no-unused-vars
    })
    test('post request is missing mandatory NAME field', async () => {
      const userLogin = await api.post('/api/login').send(validUser)
      const result = await api
        .post(`/api/events`)
        .send(invalidEvent[0])
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body.error).toEqual(['event.name cannot be null'])
    })
    test('post request is missing mandatory CONTENT field', async () => {
      const userLogin = await api.post('/api/login').send(validUser)
      const result = await api
        .post(`/api/events`)
        .send(invalidEvent[1])
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body.error).toEqual(['event.content cannot be null'])
    })
    test('post request is missing mandatory POSTED_ON field', async () => {
      const userLogin = await api.post('/api/login').send(validUser)
      const result = await api
        .post(`/api/events`)
        .send(invalidEvent[2])
        .set('Authorization', `Bearer ${userLogin.body.token}`)

      expect(result.body.error).toEqual(['event.posted_on cannot be null'])
    })

    // test('Adding an post that has the same post_url field', async () => {
    //   await api.post('/api/events').send(data)
    //   const eventWithDuplicateUrl = await api
    //     .post('/api/events')
    //     .send({ ...data, id: 8888 })

    //   expect(eventWithDuplicateUrl.body).toEqual({
    //     error: ['post_url must be unique'],
    //   })
    // })

    describe('add events with 10 m distance to each other', () => {
      let dummyData = []

      beforeAll(async () => {
        await Event.destroy({
          where: {
            name: 'Muusikkojen liitto',
          },
        })
        const userLogin = await api.post('/api/login').send(validUser)

        // create 10 dummy objects
        for (let i = 0; i < 10; i++) {
          new_latitude = 60 + (10 * i + 1) / 111111
          const location = {
            type: 'Point',
            coordinates: [new_latitude, 25],
          }
          // POST the data to your API endpoint and add it to the array
          const result = await api
            .post(`/api/events`)
            .send({
              ...CreateEvents[0],
              post_url: `url${i}`,
              location: location,
            })
            .set('Authorization', `Bearer ${userLogin.body.token}`)

          dummyData.push(result.body)
        }
      })
      test('expect api to return all added events', async () => {
        const result = await api.get('/api/events')
        expect(result.body.length).toEqual(dummyData.length)
        for (let i = 0; i < 10; i++) {
          expect(result.body[i]).toEqual(dummyData[i])
        }
      })

      test('expect to return all events inside a 10 m radius', async () => {
        const result = await api
          .get('/api/events')
          .send({ search: { origin: [60, 25], radius: 10 } })
        expect(result.body).toEqual(1)
      })

      test('expect to return all events inside a 50 m radius', async () => {
        const result = await api
          .get('/api/events')
          .send({ search: { origin: [60, 25], radius: 50 } })
        expect(result.body).toEqual(5)
      })
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
