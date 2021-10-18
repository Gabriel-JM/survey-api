import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoadSurveyResultController, makeSaveSurveyResultController } from '../factories/controllers'
import { authMiddleware } from '../middlewares'

export default (router: Router) => {
  const saveSurveyResultController = adaptRoute(makeSaveSurveyResultController())
  router.put('/surveys/:surveyId/results', authMiddleware, saveSurveyResultController)

  const loadSurveyResultController = adaptRoute(makeLoadSurveyResultController())
  router.get('/surveys/:surveyId/results', authMiddleware, loadSurveyResultController)
}
