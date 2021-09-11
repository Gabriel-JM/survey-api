import { Collection } from 'mongodb'
import request from 'supertest'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'
import bcrypt from 'bcrypt'

describe('Login Routes', () => {
  let accountCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    it('should return 200 on signup', async () => {
      await request(app)
        .post('/api/signup')
        .send({
          name: 'Gabriel José',
          email: 'email@mail.com',
          password: '123',
          passwordConfirmation: '123'
        })
        .expect(200)
    })
  })

  describe('POST /login', () => {
    it('should return 200 on login', async () => {
      const password = await bcrypt.hash('123', 12)
      await accountCollection.insertOne({
        name: 'Gabriel José',
        email: 'email@mail.com',
        password
      })

      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: '123'
        })
        .expect(200)
    })

    it('should return 401 on login, if not found the account', async () => {
      await request(app)
        .post('/api/login')
        .send({
          email: 'email@mail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
