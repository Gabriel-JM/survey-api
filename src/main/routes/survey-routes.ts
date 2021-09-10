import { Router } from 'express'
import { adaptMiddleware } from '../adapters/express-middleware-adapter'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController, makeLoadSurveysController } from '../factories/controllers'
import { makeAuthMiddleware } from '../factories/middlewares'

export default (router: Router) => {
  const adminAuthMiddleware = makeAuthMiddleware('admin')
  const authMiddleware = makeAuthMiddleware()

  const addSurveyController = makeAddSurveyController()

  router.post(
    '/surveys',
    adaptMiddleware(adminAuthMiddleware),
    adaptRoute(addSurveyController)
  )

  const loadSurveysController = makeLoadSurveysController()

  router.get(
    '/surveys',
    adaptMiddleware(authMiddleware),
    adaptRoute(loadSurveysController)
  )
}
