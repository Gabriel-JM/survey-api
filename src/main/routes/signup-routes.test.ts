import request from 'supertest'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import app from '../config/app'

describe('Signup Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  it('shoudl return an account on success', async () => {
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
