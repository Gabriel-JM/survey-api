import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeAddSurveyController } from '../factories/controllers'

export default (router: Router) => {
  const signupController = makeAddSurveyController()

  router.post('/surveys', adaptRoute(signupController))
}
