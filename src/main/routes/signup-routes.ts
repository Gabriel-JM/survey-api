import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeSignUpController } from '../factories/signup/signup-factory'

const signupController = makeSignUpController()

export default (router: Router) => {
  router.post('/signup', adaptRoute(signupController))
}
