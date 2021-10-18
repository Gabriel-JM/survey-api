import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import { sign } from 'jsonwebtoken'
import env from '../config/env'

let accountCollection: Collection
let surveyCollection: Collection

async function makeAccessToken () {
  const res = await accountCollection.insertOne({
    name: 'Gabriel',
    email: 'gabriel@email.com',
    password: '123'
  })

  const id = res.ops[0]._id
  const accessToken = sign({ id }, env.jwtSecret)

  await accountCollection.updateOne({ _id: id }, {
    $set: { accessToken }
  })

  await surveyCollection.insertMany([{
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    date: new Date()
  }, {
    question: 'other_question',
    answers: [{
      image: 'other_image',
      answer: 'other_answer'
    }],
    date: new Date()
  }])

  return accessToken
}

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('PUT /surveys/:surveyId/results', () => {
    it('should return 403 on save survey result without access token', async () => {
      await request(app)
        .put('/api/surveys/any_id/results')
        .send({
          answer: 'any_answer'
        })
        .expect(403)
    })

    it('should return 200 on save survey result with access token', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })

      const accessToken = await makeAccessToken()

      await request(app)
        .put(`/api/surveys/${res.ops[0]._id as string}/results`)
        .set('x-access-token', accessToken)
        .send({
          answer: 'any_answer'
        })
        .expect(200)
    })
  })

  describe('GET /surveys/:surveyId/results', () => {
    it('should return 403 on load survey result without access token', async () => {
      await request(app)
        .get('/api/surveys/any_id/results')
        .expect(403)
    })

    it('should return 200 on load survey result with access token', async () => {
      const res = await surveyCollection.insertOne({
        question: 'any_question',
        answers: [{
          image: 'any_image',
          answer: 'any_answer'
        }],
        date: new Date()
      })

      const accessToken = await makeAccessToken()

      await request(app)
        .get(`/api/surveys/${res.ops[0]._id as string}/results`)
        .set('x-access-token', accessToken)
        .expect(200)
    })
  })
})
