import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router) => {
  const authMiddleware = makeAuthMiddleware('admin')

  const signupController = makeAddSurveyController()

  router.post(
    '/surveys',
    adaptMiddleware(authMiddleware),
    adaptRoute(signupController)
  )
}
