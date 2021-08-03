import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeLoginController } from '../factories/login/login-factory'
import { makeSignUpController } from '../factories/signup/signup-factory'

const signupController = makeSignUpController()
const loginController = makeLoginController()

export default (router: Router) => {
  router.post('/signup', adaptRoute(signupController))
  router.post('/login', adaptRoute(loginController))
}
