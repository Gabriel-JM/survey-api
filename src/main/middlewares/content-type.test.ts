import request from 'supertest'
import app from '../config/app'

describe('Content Type Middleware', () => {
  it('should return default content type as json', async () => {
    app.get('/test-content-type', (req, res) => res.send())

    await request(app)
      .get('/test-content-type')
      .expect('content-type', /json/)
  })

  it('should return another content type when needed', async () => {
    app.get('/test-content-type_xml', (req, res) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test-content-type_xml')
      .expect('content-type', /xml/)
  })
})
