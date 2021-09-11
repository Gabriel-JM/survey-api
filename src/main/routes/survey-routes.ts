import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController, makeLoadSurveysController } from '../factories/controllers'
import { adminAuthMiddleware, authMiddleware } from '../middlewares'

export default (router: Router) => {
  const addSurveyController = adaptRoute(makeAddSurveyController())
  router.post('/surveys', adminAuthMiddleware, addSurveyController)

  const loadSurveysController = adaptRoute(makeLoadSurveysController())
  router.get('/surveys', authMiddleware, loadSurveysController)
}
