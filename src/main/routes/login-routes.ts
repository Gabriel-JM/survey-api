import { Router } from 'express'
import { adaptRoute } from '../adapters/express-route-adapter'
import { makeLoginController, makeSignUpController } from '../factories/controllers'

export default (router: Router) => {
  const signupController = makeSignUpController()
  const loginController = makeLoginController()

  router.post('/signup', adaptRoute(signupController))
  router.post('/login', adaptRoute(loginController))
}
