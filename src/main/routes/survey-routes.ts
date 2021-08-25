import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers/add-survey/add-survey-controller-factory'

export default (router: Router) => {
  const signupController = makeAddSurveyController()

  router.post('/surveys', adaptRoute(signupController))
}
