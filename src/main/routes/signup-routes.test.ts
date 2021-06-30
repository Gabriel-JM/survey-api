import request from 'supertest'
import app from '../config/app'

describe('Signup Routes', () => {
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
