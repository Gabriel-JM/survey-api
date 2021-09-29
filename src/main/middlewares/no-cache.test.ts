import request from 'supertest'
import app from '../config/app'
import { noCache } from './no-cache'

describe('No Cache Middleware', () => {
  test('should disable cache', async () => {
    app.get('/test_no_cache', noCache, (_req, res) => res.send())

    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('exprires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
